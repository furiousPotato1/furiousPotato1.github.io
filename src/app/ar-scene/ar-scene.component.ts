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
    setTimeout(() => this.checkCameraStatus(), 1000);
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private applyMobileOptimizations() {
    try {
      this.lockOrientation();
      document.body.addEventListener('touchstart', () => {
        console.log('Touch detected - marker tracking active');
      });
    } catch (e) {
      console.error('Mobile optimizations failed:', e);
    }
  }

  private lockOrientation() {
    const anyScreen = screen as any;
    
    if (anyScreen.orientation?.lock) {
      anyScreen.orientation.lock('landscape')
        .catch((error: any) => console.log('Orientation lock failed:', error));
    } else if (anyScreen.lockOrientation) {
      anyScreen.lockOrientation('landscape');
    } else if (anyScreen.mozLockOrientation) {
      anyScreen.mozLockOrientation('landscape');
    } else if (anyScreen.msLockOrientation) {
      anyScreen.msLockOrientation('landscape');
    } else {
      console.log('Orientation lock not supported');
    }
  }

  checkCameraStatus(): boolean {
    const scene = document.querySelector('a-scene') as AFrameScene | null;
    
    // Safe property access with optional chaining
    const arSource = scene?.systems?.arjs?._arSource;
    this.isCameraActive = arSource?.ready ?? false;
    
    return this.isCameraActive;
  }
}
