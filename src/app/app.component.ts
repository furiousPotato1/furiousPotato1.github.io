import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArSceneComponent } from "./ar-scene/ar-scene.component";
import { UnsupportedOverlayComponent } from './unsupported-overlay/unsupported-overlay.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ArSceneComponent, UnsupportedOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'demo-projects';

	arSupported = true;
  statusText = 'Initializing...';
  browserInfo = '';
  platformInfo = '';
  webglSupported = false;
  webrtcSupported = false;
  isMobile = false;
  isAndroid = false;
  isIOS = false;
  showDebug = true; // Set to false in production

  async ngOnInit() {
    this.checkFeatures();
    this.updateDebugInfo();

		if (this.arSupported) {
			const hasPermission = await this.requestCameraPermission();
			if (!hasPermission) {
				this.statusText = 'Camera permission required';
			}
		}
  }

	async requestCameraPermission() {
		try {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				const stream = await navigator.mediaDevices.getUserMedia({ 
					video: { facingMode: 'environment' } 
				});
				
				// Stop tracks immediately since AR.js will handle the camera
				stream.getTracks().forEach(track => track.stop());
				
				this.statusText = 'Camera permission granted - Loading AR';
				return true;
			}
			return false;
		} catch (error) {
			console.error('Camera permission error:', error);
			this.statusText = `Camera error: ${(error as Error).message || 'Permission denied'}`;
			return false;
		}
	}

  private checkFeatures() {
    // Set device info
    this.browserInfo = navigator.userAgent;
    this.platformInfo = navigator.platform;
    
    // Check if mobile
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isAndroid = /Android/i.test(navigator.userAgent);
    this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      this.webglSupported = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      this.webglSupported = false;
    }
    
    // Check WebRTC support
    this.webrtcSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    
    // Determine if AR is supported
    this.arSupported = this.webglSupported && this.webrtcSupported;
    
    // Update status text
    this.statusText = this.arSupported 
      ? 'AR features enabled - Point camera at Hiro marker' 
      : 'Required features disabled';
  }

  private updateDebugInfo() {
    // Check AR status after 5 seconds
    setTimeout(() => {
      const arScene: any = document.querySelector('app-ar-scene');
      if (arScene && !arScene['isCameraActive']?.()) {
        this.statusText = 'Camera not initialized - check permissions';
      }
    }, 5000);
  }

  retry() {
    window.location.reload();
  }

  toggleDebug() {
    this.showDebug = !this.showDebug;
  }
}
