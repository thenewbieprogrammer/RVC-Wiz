const API_BASE_URL = "http://localhost:8000";

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

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
  id: number;
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
  is_downloaded?: boolean;
  download_progress?: number;
  download_error?: string;
  local_path?: string;
  index_path?: string;
  created_at?: string;
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

    const response = await fetch(`${this.baseUrl}/api/upload`, {
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
      `/api/process?filename=${encodeURIComponent(filename)}`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  async getProcessingStatus(taskId: string): Promise<ProcessingStatus> {
    return this.request<ProcessingStatus>(`/api/status/${taskId}`);
  }

  async downloadResult(filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/download/${filename}`);
    
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

  // Local Voice Models API methods
  async getLocalVoiceModels(limit: number = 50): Promise<VoiceModelsResponse> {
    return this.request<VoiceModelsResponse>(`/api/voice-models/local?limit=${limit}`);
  }

  async getDownloadedVoiceModels(): Promise<VoiceModelsResponse> {
    return this.request<VoiceModelsResponse>("/api/voice-models/local/downloaded");
  }

  async syncVoiceModels(limit: number = 50): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/voice-models/sync?limit=${limit}`, {
      method: "POST",
    });
  }

  async downloadVoiceModel(modelId: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/voice-models/download/${modelId}`, {
      method: "POST",
    });
  }

  async getDownloadStatus(modelId: number): Promise<{
    success: boolean;
    model_id: number;
    is_downloaded: boolean;
    download_progress: number;
    download_error?: string;
    local_path?: string;
    index_path?: string;
  }> {
    return this.request(`/api/voice-models/${modelId}/download-status`);
  }

  async deleteVoiceModel(modelId: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/voice-models/${modelId}`, {
      method: "DELETE",
    });
  }

  async getVoiceModelStats(): Promise<{ success: boolean; stats: any }> {
    return this.request<{ success: boolean; stats: any }>("/api/voice-models/stats");
  }

  async scanExistingModels(): Promise<{ 
    success: boolean; 
    message: string; 
    registered_models: any[]; 
    count: number; 
  }> {
    return this.request<{ 
      success: boolean; 
      message: string; 
      registered_models: any[]; 
      count: number; 
    }>("/api/voice-models/scan-existing", {
      method: "POST",
    });
  }

  // Text-to-Speech API methods
  async processTextToSpeech(
    text: string, 
    modelName: string, 
    options?: {
      tts_engine?: string;
      language?: string;
      enhance_quality?: boolean;
      noise_reduction?: boolean;
    }
  ): Promise<{ task_id: string }> {
    return this.request<{ task_id: string }>("/api/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        text,
        model_name: modelName,
        enhance_quality: options?.enhance_quality ?? true,
        noise_reduction: options?.noise_reduction ?? true,
        tts_engine: options?.tts_engine ?? "pyttsx3",
        language: options?.language ?? "en"
      })
    });
  }

  // Live Audio Processing API methods
  async startLiveAudio(modelName: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/api/live-audio/start", {
      method: "POST",
      body: JSON.stringify({ model_name: modelName })
    });
  }

  async stopLiveAudio(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/api/live-audio/stop", {
      method: "POST"
    });
  }

  async getLiveAudioStatus(): Promise<{ 
    is_running: boolean; 
    is_processing: boolean; 
    current_model: string | null; 
    connected_clients: number; 
  }> {
    return this.request<{ 
      is_running: boolean; 
      is_processing: boolean; 
      current_model: string | null; 
      connected_clients: number; 
    }>("/api/live-audio/status");
  }

  // TTS Engine API methods
  async getTTSVoices(): Promise<{ 
    available_engines: string[]; 
    voices: { [engine: string]: any[] }; 
  }> {
    return this.request<{ 
      available_engines: string[]; 
      voices: { [engine: string]: any[] }; 
    }>("/api/tts/voices");
  }

  // RVC Model API methods
  async getLoadedRVCModels(): Promise<{ loaded_models: string[] }> {
    return this.request<{ loaded_models: string[] }>("/api/rvc/models/loaded");
  }

  // Microphone API methods
  async getMicrophoneDevices(): Promise<{ success: boolean; devices: any[] }> {
    return this.request<{ success: boolean; devices: any[] }>("/api/microphone/devices");
  }

  async selectMicrophone(deviceId: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/api/microphone/select", {
      method: "POST",
      body: JSON.stringify({ device_id: deviceId })
    });
  }

  async getMicrophoneStatus(): Promise<{ success: boolean; status: any }> {
    return this.request<{ success: boolean; status: any }>("/api/microphone/status");
  }

  async testMicrophone(deviceId?: number): Promise<{ success: boolean; result: any }> {
    return this.request<{ success: boolean; result: any }>("/api/microphone/test", {
      method: "POST",
      body: JSON.stringify({ device_id: deviceId })
    });
  }

  async getMicrophoneInfo(): Promise<{ success: boolean; info: any }> {
    return this.request<{ success: boolean; info: any }>("/api/microphone/info");
  }

  // Live Recording API methods
  async startLiveRecording(modelName: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/api/live-recording/start", {
      method: "POST",
      body: JSON.stringify({ model_name: modelName })
    });
  }

  async stopLiveRecording(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/api/live-recording/stop", {
      method: "POST"
    });
  }

  async getLiveRecordingStatus(): Promise<{ success: boolean; status: any }> {
    return this.request<{ success: boolean; status: any }>("/api/live-recording/status");
  }

  async recordAndProcess(duration: number, modelName: string): Promise<{ 
    success: boolean; 
    output_file?: string; 
    message?: string; 
    error?: string; 
  }> {
    return this.request<{ 
      success: boolean; 
      output_file?: string; 
      message?: string; 
      error?: string; 
    }>("/api/live-recording/record", {
      method: "POST",
      body: JSON.stringify({ 
        duration: duration, 
        model_name: modelName 
      })
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
