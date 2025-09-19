import {
  createHotContext
} from "/build/_shared/chunk-PAD7UL62.js";

// app/utils/api.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\api.ts"
  );
  import.meta.hot.lastModified = "1758248457339.6526";
}
var API_BASE_URL = "http://localhost:8000";
var ApiClient = class {
  baseUrl;
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }
  async uploadAudio(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return response.json();
  }
  async getModels() {
    return this.request("/models");
  }
  async processAudio(filename, request) {
    return this.request(
      `/process/${filename}`,
      {
        method: "POST",
        body: JSON.stringify(request)
      }
    );
  }
  async getProcessingStatus(taskId) {
    return this.request(`/status/${taskId}`);
  }
  async downloadResult(filename) {
    const response = await fetch(`${this.baseUrl}/download/${filename}`);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    return response.blob();
  }
  async cleanupFiles() {
    return this.request("/cleanup", {
      method: "DELETE"
    });
  }
  async healthCheck() {
    return this.request("/health");
  }
  // Voice Models API methods
  async getTopVoiceModels(limit = 50) {
    return this.request(`/api/voice-models/top?limit=${limit}`);
  }
  async searchVoiceModels(query, limit = 20) {
    return this.request(`/api/voice-models/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }
  async getRickSanchezModels() {
    return this.request("/api/voice-models/rick-sanchez");
  }
  async getFeaturedVoiceModels() {
    return this.request("/api/voice-models/featured");
  }
  async getVoiceModelCategories() {
    return this.request("/api/voice-models/categories");
  }
};
var apiClient = new ApiClient();

export {
  apiClient
};
//# sourceMappingURL=/build/_shared/chunk-IXVPANFZ.js.map
