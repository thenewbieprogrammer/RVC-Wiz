import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw,
  Monitor,
  Volume2,
  Cpu,
  Database,
  Globe
} from "lucide-react";
import GlassCard from "~/components/GlassCard";
import { apiClient } from "~/utils/api";

export default function Settings() {
  const [settings, setSettings] = useState({
    audioQuality: "high",
    sampleRate: 44100,
    bitDepth: 16,
    autoCleanup: true,
    cleanupInterval: 60,
    maxFileSize: 100,
    theme: "dark",
    language: "en",
    notifications: true,
    gpuAcceleration: true,
    modelCache: true,
    apiEndpoint: "http://localhost:8000"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("rvc-wiz-settings");
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("rvc-wiz-settings", JSON.stringify(settings));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const defaultSettings = {
        audioQuality: "high",
        sampleRate: 44100,
        bitDepth: 16,
        autoCleanup: true,
        cleanupInterval: 60,
        maxFileSize: 100,
        theme: "dark",
        language: "en",
        notifications: true,
        gpuAcceleration: true,
        modelCache: true,
        apiEndpoint: "http://localhost:8000"
      };
      setSettings(defaultSettings);
      localStorage.setItem("rvc-wiz-settings", JSON.stringify(defaultSettings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Settings reset to defaults!");
    } catch (error) {
      alert("Failed to reset settings");
    } finally {
      setIsResetting(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Settings</h1>
              <p className="text-white/70">Configure RVC-Wiz preferences</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              disabled={isResetting}
              className="glass-button flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="glass-button bg-primary-500/20 border-primary-400/50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Settings */}
        <GlassCard delay={0.1}>
          <div className="flex items-center space-x-2 mb-4">
            <Volume2 className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">Audio Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Audio Quality</label>
              <select
                value={settings.audioQuality}
                onChange={(e) => handleInputChange("audioQuality", e.target.value)}
                className="glass-input w-full"
              >
                <option value="low">Low (16kHz)</option>
                <option value="medium">Medium (22kHz)</option>
                <option value="high">High (44.1kHz)</option>
                <option value="ultra">Ultra (48kHz)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sample Rate</label>
              <select
                value={settings.sampleRate}
                onChange={(e) => handleInputChange("sampleRate", parseInt(e.target.value))}
                className="glass-input w-full"
              >
                <option value={16000}>16,000 Hz</option>
                <option value={22050}>22,050 Hz</option>
                <option value={44100}>44,100 Hz</option>
                <option value={48000}>48,000 Hz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bit Depth</label>
              <select
                value={settings.bitDepth}
                onChange={(e) => handleInputChange("bitDepth", parseInt(e.target.value))}
                className="glass-input w-full"
              >
                <option value={16}>16-bit</option>
                <option value={24}>24-bit</option>
                <option value={32}>32-bit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max File Size: {settings.maxFileSize} MB
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={settings.maxFileSize}
                onChange={(e) => handleInputChange("maxFileSize", parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </GlassCard>

        {/* Performance Settings */}
        <GlassCard delay={0.2}>
          <div className="flex items-center space-x-2 mb-4">
            <Cpu className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">Performance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">GPU Acceleration</label>
              <input
                type="checkbox"
                checked={settings.gpuAcceleration}
                onChange={(e) => handleInputChange("gpuAcceleration", e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Model Caching</label>
              <input
                type="checkbox"
                checked={settings.modelCache}
                onChange={(e) => handleInputChange("modelCache", e.target.checked)}
                className="rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cleanup Interval: {settings.cleanupInterval} minutes
              </label>
              <input
                type="range"
                min="10"
                max="240"
                value={settings.cleanupInterval}
                onChange={(e) => handleInputChange("cleanupInterval", parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Cleanup</label>
              <input
                type="checkbox"
                checked={settings.autoCleanup}
                onChange={(e) => handleInputChange("autoCleanup", e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </GlassCard>

        {/* Interface Settings */}
        <GlassCard delay={0.3}>
          <div className="flex items-center space-x-2 mb-4">
            <Monitor className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">Interface</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                className="glass-input w-full"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="glass-input w-full"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleInputChange("notifications", e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </GlassCard>

        {/* API Settings */}
        <GlassCard delay={0.4}>
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">API Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Endpoint</label>
              <input
                type="url"
                value={settings.apiEndpoint}
                onChange={(e) => handleInputChange("apiEndpoint", e.target.value)}
                className="glass-input w-full"
                placeholder="http://localhost:8000"
              />
            </div>

            <div className="glass p-3 rounded-lg">
              <h3 className="font-medium mb-2">Connection Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/70">Connected</span>
              </div>
            </div>

            <div className="glass p-3 rounded-lg">
              <h3 className="font-medium mb-2">System Info</h3>
              <div className="text-sm text-white/70 space-y-1">
                <p>Platform: {navigator.platform}</p>
                <p>User Agent: {navigator.userAgent.split(' ')[0]}</p>
                <p>Memory: {navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
