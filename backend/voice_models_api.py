import requests
import json
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse

class VoiceModelsAPI:
    def __init__(self):
        self.base_url = "https://voice-models.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def fetch_top_models(self, limit: int = 50) -> List[Dict]:
        """Fetch top voice models from voice-models.com"""
        try:
            response = self.session.get(self.base_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            models = []
            
            # Find the table with voice models
            table = soup.find('table')
            if not table:
                return models
            
            rows = table.find_all('tr')[1:]  # Skip header row
            
            for row in rows[:limit]:
                cells = row.find_all('td')
                if len(cells) >= 2:
                    model_data = self._parse_model_row(cells)
                    if model_data:
                        models.append(model_data)
            
            return models
            
        except Exception as e:
            print(f"Error fetching top models: {e}")
            return []

    def search_models(self, query: str, limit: int = 20) -> List[Dict]:
        """Search for specific voice models"""
        try:
            # For now, we'll search through the top models
            # In a real implementation, you'd use the site's search functionality
            all_models = self.fetch_top_models(100)
            
            query_lower = query.lower()
            matching_models = []
            
            for model in all_models:
                if (query_lower in model.get('name', '').lower() or 
                    query_lower in model.get('description', '').lower()):
                    matching_models.append(model)
                    
                if len(matching_models) >= limit:
                    break
            
            return matching_models
            
        except Exception as e:
            print(f"Error searching models: {e}")
            return []

    def _parse_model_row(self, cells) -> Optional[Dict]:
        """Parse a table row to extract model information"""
        try:
            if len(cells) < 2:
                return None
                
            # Extract model name and link from first cell
            first_cell = cells[0]
            link = first_cell.find('a')
            
            if not link:
                return None
                
            model_name = link.get_text(strip=True)
            model_url = link.get('href', '')
            
            # Extract download URL from second cell
            download_cell = cells[1]
            download_link = download_cell.find('a')
            download_url = download_link.get('href', '') if download_link else ''
            
            # Extract HuggingFace URL from third cell
            hf_cell = cells[2] if len(cells) > 2 else None
            hf_url = ''
            if hf_cell:
                hf_link = hf_cell.find('a')
                if hf_link:
                    hf_url = hf_link.get('href', '')
            
            # Parse model name to extract character/source
            character_name = self._extract_character_name(model_name)
            
            return {
                'id': model_url.split('/')[-1] if model_url else '',
                'name': model_name,
                'character': character_name,
                'description': f"AI voice model for {character_name}",
                'download_url': download_url,
                'huggingface_url': hf_url,
                'model_url': urljoin(self.base_url, model_url) if model_url else '',
                'size': 'Unknown',  # Size not easily extractable from the table
                'epochs': self._extract_epochs(model_name),
                'type': 'RVC',
                'tags': self._extract_tags(model_name)
            }
            
        except Exception as e:
            print(f"Error parsing model row: {e}")
            return None

    def _extract_character_name(self, model_name: str) -> str:
        """Extract character name from model name"""
        # Remove common suffixes and extract the main character name
        name = model_name
        
        # Remove epoch information
        name = re.sub(r'\s*\(\d+\s*Epochs?\)', '', name)
        name = re.sub(r'\s*\[\d+\s*Epochs?\]', '', name)
        
        # Remove technical terms
        name = re.sub(r'\s*\(RVC\s*v?2?\)', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s*\(RMVPE\)', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s*\[RVC\s*v?2?\]', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s*\[RMVPE\]', '', name, flags=re.IGNORECASE)
        
        # Remove era information in parentheses
        name = re.sub(r'\s*\([^)]*[Ee]ra[^)]*\)', '', name)
        
        # Clean up extra spaces
        name = re.sub(r'\s+', ' ', name).strip()
        
        return name

    def _extract_epochs(self, model_name: str) -> int:
        """Extract number of epochs from model name"""
        epoch_match = re.search(r'(\d+)\s*Epochs?', model_name, re.IGNORECASE)
        return int(epoch_match.group(1)) if epoch_match else 0

    def _extract_tags(self, model_name: str) -> List[str]:
        """Extract tags from model name"""
        tags = []
        
        # Add gender tags
        if re.search(r'\b(female|woman|girl)\b', model_name, re.IGNORECASE):
            tags.append('Female')
        elif re.search(r'\b(male|man|boy)\b', model_name, re.IGNORECASE):
            tags.append('Male')
        
        # Add age tags
        if re.search(r'\b(young|teen|teenage)\b', model_name, re.IGNORECASE):
            tags.append('Young')
        elif re.search(r'\b(adult|mature)\b', model_name, re.IGNORECASE):
            tags.append('Adult')
        
        # Add style tags
        if re.search(r'\b(professional|formal)\b', model_name, re.IGNORECASE):
            tags.append('Professional')
        elif re.search(r'\b(casual|friendly)\b', model_name, re.IGNORECASE):
            tags.append('Friendly')
        
        # Add language tags
        if re.search(r'\b(english|en)\b', model_name, re.IGNORECASE):
            tags.append('English')
        elif re.search(r'\b(japanese|jp|jpn)\b', model_name, re.IGNORECASE):
            tags.append('Japanese')
        
        return tags

    def get_rick_sanchez_models(self) -> List[Dict]:
        """Get Rick Sanchez voice models specifically"""
        return self.search_models("Rick Sanchez", limit=10)

    def get_featured_models(self) -> List[Dict]:
        """Get a curated list of featured models"""
        # Get top models and filter for popular characters
        top_models = self.fetch_top_models(100)
        
        # Filter for well-known characters and high-quality models
        featured = []
        popular_characters = [
            'rick', 'morty', 'spongebob', 'bart', 'homer', 'mickey', 'donald',
            'elmo', 'big bird', 'taylor swift', 'venom', 'springtrap'
        ]
        
        for model in top_models:
            model_name_lower = model['name'].lower()
            if any(char in model_name_lower for char in popular_characters):
                featured.append(model)
                
        return featured[:20]  # Return top 20 featured models

# Example usage and testing
if __name__ == "__main__":
    api = VoiceModelsAPI()
    
    print("Fetching top models...")
    top_models = api.fetch_top_models(10)
    print(f"Found {len(top_models)} top models")
    
    print("\nSearching for Rick Sanchez...")
    rick_models = api.get_rick_sanchez_models()
    print(f"Found {len(rick_models)} Rick Sanchez models")
    
    print("\nGetting featured models...")
    featured = api.get_featured_models()
    print(f"Found {len(featured)} featured models")
    
    # Print sample data
    if top_models:
        print("\nSample model:")
        print(json.dumps(top_models[0], indent=2))
