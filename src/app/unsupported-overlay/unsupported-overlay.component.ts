import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-unsupported-overlay',
  standalone: true,
  templateUrl: './unsupported-overlay.component.html',
  styleUrls: ['./unsupported-overlay.component.less'],
	imports:[CommonModule]
})
export class UnsupportedOverlayComponent {
  @Input() webglSupported = false;
  @Input() webrtcSupported = false;
  @Input() isAndroid = false;
  @Input() isIOS = false;
  
  @Output() retry = new EventEmitter<void>();
}