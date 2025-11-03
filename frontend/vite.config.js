import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const serverConfig = {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'IKM',
          short_name: 'IKM',
          description: 'Multimedia player or ready',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
  };

  if (process.env.VITE_HOST) {
    serverConfig.server = {
      host: process.env.VITE_HOST,
      port: parseInt(process.env.VITE_PORT),
      https: false
    };
  }

  return defineConfig(serverConfig);
};