import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit  } from '@angular/core';

type AFrameScene = HTMLElement & {
  systems: {
    arjs?: {
      _arSource?: {
        ready: boolean;
      }
    }
  };
};

@Component({
  selector: 'app-ar-scene',
  standalone: true,
  imports: [CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ar-scene.component.html',
  styleUrl: './ar-scene.component.less'
})
export class ArSceneComponent implements OnInit {
	isCameraActive = false;

  ngOnInit() {
    if (this.isMobileDevice()) {
      this.applyMobileOptimizations();
    }
  }

  ngAfterViewInit() {
    this.initializeCamera();
  }

  private initializeCamera() {
    // Wait for A-Frame to initialize
    const scene = document.querySelector('a-scene') as any;
    if (scene?.Loaded) {
      this.setupCamera();
    } else {
      scene?.addEventListener('loaded', () => this.setupCamera());
    }
  }

  private setupCamera() {
    const arSystem = (document.querySelector('a-scene') as any)?.systems?.arjs;
    
    if (!arSystem) {
      console.error('AR.js system not found');
      this.updateCameraStatus('AR.js system not initialized');
      return;
    }

    // Check if camera is ready
    const checkCamera = () => {
      if (arSystem._arSource?.ready) {
        this.isCameraActive = true;
        this.updateCameraStatus('Camera active - Point at Hiro marker');
      } else {
        this.updateCameraStatus('Starting camera...');
        setTimeout(checkCamera, 500);
      }
    };
    
    checkCamera();
    
    // Handle camera errors
    arSystem._arSource.onError = (error: any) => {
      console.error('Camera error:', error);
      this.updateCameraStatus(`Camera error: ${error.message || error}`);
    };
  }

  private updateCameraStatus(message: string) {
    const statusText = document.getElementById('camera-status');
    if (statusText) {
      statusText.setAttribute('value', message);
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private applyMobileOptimizations() {
    try {
      // Remove orientation lock for now as it might interfere
      // Add touch events
      document.body.addEventListener('touchstart', () => {
        console.log('Touch detected - attempting to resume camera');
        this.resumeCamera();
      });
      
      // Add visibility change handler
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.resumeCamera();
        }
      });
    } catch (e) {
      console.error('Mobile optimizations failed:', e);
    }
  }

  private resumeCamera() {
    const scene = document.querySelector('a-scene');
    const arSource = (scene as any)?.systems?.arjs?._arSource;
    
    if (arSource && !arSource.ready) {
      console.log('Resuming camera');
      arSource.init().then(() => {
        arSource.onResume();
        this.updateCameraStatus('Camera resumed');
      }).catch((error: any) => {
        this.updateCameraStatus(`Camera error: ${error.message || error}`);
      });
    }
  }
}
