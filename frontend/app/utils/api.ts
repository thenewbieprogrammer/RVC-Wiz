const API_BASE_URL = "http://localhost:8000";

export interface UploadResponse {
  filename: string;
  file_path: string;
  size: number;
  content_type: string;
}

export interface ProcessingRequest {
  model_name: string;
  enhance_quality: boolean;
  noise_reduction: boolean;
  pitch_shift?: number;
}

export interface ProcessingStatus {
  task_id: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  message: string;
  result_file?: string;
}

export interface Model {
  name: string;
  path: string;
  size: number;
}

export interface VoiceModel {
  id: string;
  name: string;
  character: string;
  description: string;
  download_url: string;
  huggingface_url: string;
  model_url: string;
  size: string;
  epochs: number;
  type: string;
  tags: string[];
}

export interface VoiceModelsResponse {
  success: boolean;
  models: VoiceModel[];
  count: number;
}

export interface SearchResponse extends VoiceModelsResponse {
  query: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: {
    gender: string[];
    age: string[];
    style: string[];
    language: string[];
    character_type: string[];
  };
  all_tags: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadAudio(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getModels(): Promise<{ models: Model[] }> {
    return this.request<{ models: Model[] }>("/models");
  }

  async processAudio(
    filename: string,
    request: ProcessingRequest
  ): Promise<{ task_id: string; status: string }> {
    return this.request<{ task_id: string; status: string }>(
      `/process/${filename}`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  async getProcessingStatus(taskId: string): Promise<ProcessingStatus> {
    return this.request<ProcessingStatus>(`/status/${taskId}`);
  }

  async downloadResult(filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/download/${filename}`);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async cleanupFiles(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/cleanup", {
      method: "DELETE",
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/health");
  }

  // Voice Models API methods
  async getTopVoiceModels(limit: number = 50): Promise<VoiceModelsResponse> {
    return this.request<VoiceModelsResponse>(`/api/voice-models/top?limit=${limit}`);
  }

  async searchVoiceModels(query: string, limit: number = 20): Promise<SearchResponse> {
    return this.request<SearchResponse>(`/api/voice-models/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getRickSanchezModels(): Promise<VoiceModelsResponse> {
    return this.request<VoiceModelsResponse>("/api/voice-models/rick-sanchez");
  }

  async getFeaturedVoiceModels(): Promise<VoiceModelsResponse> {
    return this.request<VoiceModelsResponse>("/api/voice-models/featured");
  }

  async getVoiceModelCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>("/api/voice-models/categories");
  }

  // Text-to-Speech API methods
  async processTextToSpeech(text: string, modelName: string): Promise<{ task_id: string }> {
    return this.request<{ task_id: string }>("/api/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        text,
        model_name: modelName,
        enhance_quality: true,
        noise_reduction: true
      })
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
