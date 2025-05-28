import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArSceneComponent } from "./ar-scene/ar-scene.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ArSceneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'demo-projects';
}
