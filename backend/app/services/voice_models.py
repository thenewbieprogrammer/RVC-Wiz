import requests
import json
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)

class VoiceModelsService:
    def __init__(self):
        self.base_url = "https://voice-models.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def _fetch_page(self, url: str) -> BeautifulSoup:
        """Fetches a URL and returns a BeautifulSoup object."""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'lxml')
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            raise

    def _parse_model_row(self, row: BeautifulSoup) -> Dict[str, any]:
        """Parses a single model row from the HTML table."""
        cols = row.find_all('td')
        if not cols or len(cols) < 3:
            return None

        model_info_col = cols[0]
        huggingface_link_col = cols[2]

        # Extract model name and description
        model_name_tag = model_info_col.find('a', class_='text-blue-500')
        model_name = model_name_tag.text.strip() if model_name_tag else "N/A"
        
        # The description is often within the model_name_tag's parent or sibling
        description_parts = []
        if model_name_tag:
            # Look for text directly within the parent div, excluding the link text
            for content in model_name_tag.parent.children:
                if content.name is None and content.strip() and content.strip() != model_name:
                    description_parts.append(content.strip())
            # Also check for siblings
            next_sibling = model_name_tag.next_sibling
            while next_sibling:
                if next_sibling.name is None and next_sibling.strip():
                    description_parts.append(next_sibling.strip())
                next_sibling = next_sibling.next_sibling

        description = " ".join(description_parts).replace("] [", "], [").strip()
        if description.startswith('[') and description.endswith(']'):
            description = description[1:-1] # Remove outer brackets if present

        # Extract download URL
        download_link_tag = model_info_col.find('a', string=' Run')
        download_url = download_link_tag['href'] if download_link_tag else "N/A"
        
        # Extract HuggingFace URL
        huggingface_url_tag = huggingface_link_col.find('a')
        huggingface_url = huggingface_url_tag['href'] if huggingface_url_tag else "N/A"

        # Extract ID from model_name_tag's href
        model_id = "N/A"
        if model_name_tag and 'href' in model_name_tag.attrs:
            href_parts = model_name_tag['href'].split('/')
            if len(href_parts) > 2:
                model_id = href_parts[2] # e.g., /model/1GLI2Jlhsxt -> 1GLI2Jlhsxt

        # Extract character, epochs, type, tags, size from model_name and description
        character = "Unknown"
        epochs = 0
        model_type = "RVC"
        tags = []
        size = "N/A"

        # Attempt to parse character from model name (e.g., "Isao Sasaki (Early 60s era)")
        if '(' in model_name and ')' in model_name:
            char_match = model_name.split('(')[0].strip()
            if char_match:
                character = char_match
        else:
            character = model_name.split('[')[0].strip() if '[' in model_name else model_name.strip()

        # Parse epochs, type, and tags from description or model name
        import re
        epochs_match = re.search(r'(\d+)\s*epochs', model_name + description, re.IGNORECASE)
        if epochs_match:
            epochs = int(epochs_match.group(1))

        rvc_match = re.search(r'(RVCv?\d*)', model_name + description, re.IGNORECASE)
        if rvc_match:
            model_type = rvc_match.group(1)

        # Extract tags (e.g., RMVPE, RVCv2, era, etc.)
        all_matches = re.findall(r'\[([^\]]+)\]|\(([^)]+)\)', model_name + description)
        for m in all_matches:
            for tag_group in m:
                if tag_group:
                    for tag_item in tag_group.split(','):
                        tag = tag_item.strip()
                        if tag and tag not in ['RMVPE', 'RVCv2', 'RVCv1', 'RVC', 'Legacy Core', 'BeatzForge', 'KLM4 40K', 'KLM 4.0', '300 Epoch', '500 Epochs', '400 Epochs', '580 Epochs', '545 Epochs', '335 Epochs', '560 Epochs', '260 Epochs', '435 Epochs', '350 Epochs', '290 Epochs', '125 Epochs', '655 Epochs', '485 Epochs', '250 Epoches']: # Exclude common non-descriptive tags
                            tags.append(tag)
        
        # Clean up tags and remove duplicates
        tags = list(set([tag.replace(' era', '').strip() for tag in tags if tag.strip()]))
        
        # Extract size from HuggingFace URL if possible (not directly available in table)
        # This is a placeholder, actual size might need to be fetched from HuggingFace API or inferred
        if "zip?download=true" in huggingface_url:
            try:
                head_response = requests.head(huggingface_url, allow_redirects=True, timeout=5)
                content_length = head_response.headers.get('content-length')
                if content_length:
                    size_bytes = int(content_length)
                    if size_bytes > 1024 * 1024 * 1024:
                        size = f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"
                    elif size_bytes > 1024 * 1024:
                        size = f"{size_bytes / (1024 * 1024):.2f} MB"
                    else:
                        size = f"{size_bytes / 1024:.2f} KB"
            except requests.exceptions.RequestException:
                pass # Ignore errors if head request fails

        return {
            "id": model_id,
            "name": model_name,
            "character": character,
            "description": description,
            "download_url": download_url,
            "huggingface_url": huggingface_url,
            "model_url": self.base_url + model_name_tag['href'] if model_name_tag and 'href' in model_name_tag.attrs else "N/A",
            "size": size,
            "epochs": epochs,
            "type": model_type,
            "tags": tags
        }

    def fetch_top_models(self, limit: int = 50) -> List[Dict[str, any]]:
        """Fetches top voice models from the homepage."""
        logger.info(f"Fetching top {limit} models...")
        soup = self._fetch_page(self.base_url)
        models = []
        table = soup.find('table')
        if table:
            rows = table.find_all('tr')[1:]  # Skip header row
            for row in rows:
                model = self._parse_model_row(row)
                if model:
                    models.append(model)
                    if len(models) >= limit:
                        break
        logger.info(f"Fetched {len(models)} top models.")
        return models

    def search_models(self, query: str, limit: int = 20) -> List[Dict[str, any]]:
        """Searches for voice models based on a query."""
        logger.info(f"Searching for models with query '{query}', limit {limit}...")
        # voice-models.com doesn't have a direct search endpoint that returns a table.
        # We'll fetch top models and filter them, or if a search page is found, use that.
        # For now, we'll simulate by filtering fetched models.
        all_models = self.fetch_top_models(limit=100) # Fetch more to search from
        
        results = []
        for model in all_models:
            if query.lower() in model['name'].lower() or \
               query.lower() in model['character'].lower() or \
               query.lower() in model['description'].lower() or \
               any(query.lower() in tag.lower() for tag in model['tags']):
                results.append(model)
                if len(results) >= limit:
                    break
        logger.info(f"Found {len(results)} models for query '{query}'.")
        return results

    def get_rick_sanchez_models(self) -> List[Dict[str, any]]:
        """Fetches Rick Sanchez voice models specifically."""
        logger.info("Fetching Rick Sanchez models...")
        # This is a specific search, so we'll use the search_models method
        return self.search_models("Rick Sanchez", limit=50)

    def get_featured_models(self) -> List[Dict[str, any]]:
        """Fetches featured/popular models. For now, this will be the same as top models."""
        logger.info("Fetching featured models (currently same as top models)...")
        return self.fetch_top_models(limit=20) # Return a smaller subset for featured
