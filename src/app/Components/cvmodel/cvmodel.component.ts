import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { AIService } from '../../core/services/ai.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cvmodel',
  standalone: true,
  imports: [NgIf, NgClass, RouterLink],
  templateUrl: './cvmodel.component.html',
  styleUrl: './cvmodel.component.scss',
})
export class CVModelComponent implements OnInit, OnDestroy {
  selectedFileImageName: string | null = 'No file chosen';
  fileImageErrorMessage: string | null = null;
  selectedFileImage: File | null = null;
  ImageObjectURL: any = null;
  loading: boolean = false;
  inputimage?: HTMLInputElement;
  imageUrl: any;
  isSelectedFileImageOrVideo: boolean = false;
  videoUrl: any;
  inputvideo?: HTMLInputElement;
  VideoObjectURL: any = null;
  isSelectedFileVideo: boolean = false;
  selectedFileVideo: File | null = null;
  fileVideoErrorMessage: string | null = null;
  selectedFileVideoName: string | null = 'No file chosen';

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _AIService: AIService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {
        this.ngZone.runOutsideAngular(() => {
          const endTime = Number(localStorage.getItem('video_timer_end'));
          if (endTime && endTime > Date.now()) {
            // Run state update back inside Angular
            this.ngZone.run(() => {
              this.isSelectedFileVideo = true;
              this.updateCountdown(); // Also updates `countdown` which might be bound in the view
            });
            this.timerInterval = setInterval(() => {
              this.ngZone.run(() => this.updateCountdown());
            }, 1000);
          }
        });
      });
    }
  }

  onFileImageSelected(event: any): void {
    if (this.isStreaming || this.isSelectedFileImageOrVideo) {
      return;
    }
    this.isSelectedFileImageOrVideo = true;
    const input = event.target as HTMLInputElement;
    this.inputimage = input;
    if (input.files && input.files.length > 0) {
      this.selectedFileVideo = null;
      this.selectedFileVideoName = 'No file chosen';
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
        this.videoUrl = null;
      }
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null; // optional: prevent double revoke
      }
      this.fileVideoErrorMessage = null;
      if (input.files.length > 1) {
        this.loading = false;
        this.isStreaming = false;
        this.fileImageErrorMessage = 'Only one file can be uploaded at a time.';
        this.selectedFileImage = null;
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        this.selectedFileImageName = 'No file chosen';
        return;
      }
      this.loading = true;
      this.isStreaming = true;
      const file = input.files[0];
      this.handleFileImageUpload(file);
    } else {
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileImageName = 'No file chosen';
    }
  }

  handleFileImageUpload(file: File): void {
    const validTypes = ['image/png', 'image/jpeg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!validTypes.includes(file.type)) {
      this.loading = false;
      this.isStreaming = false;
      this.fileImageErrorMessage = 'Only PNG or JPG images are allowed.';
      this.selectedFileImage = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileImageName = 'No file chosen';
      return;
    }
    if (file.size > maxSize) {
      this.loading = false;
      this.isStreaming = false;
      this.fileImageErrorMessage = 'File size must not exceed 2MB.';
      this.selectedFileImage = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileImageName = 'No file chosen';
      return;
    }
    this.ImageObjectURL = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width > 1024 || img.height > 1024) {
        this.loading = false;
        this.isStreaming = false;
        this.fileImageErrorMessage =
          'Image dimensions must be 1024x1024 pixels or smaller.';
        this.selectedFileImage = null;
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        this.selectedFileImageName = 'No file chosen';
      } else {
        this.loading = true;
        this.isStreaming = true;
        this.fileImageErrorMessage = null;
        this.selectedFileImage = file;
        this.selectedFileImageName = file.name;
        this.uploadImage(this.selectedFileImage);
      }
    };
    img.onerror = () => {
      this.loading = false;
      this.isStreaming = false;
      this.fileImageErrorMessage =
        'Error loading image. Please try a different file.';
      this.selectedFileImage = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileImageName = 'No file chosen';
      URL.revokeObjectURL(this.ImageObjectURL); // clean up on error
    };
    img.src = this.ImageObjectURL;
  }

  uploadImage(file: File): void {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.loading = true;
    this.isStreaming = true;
    this._AIService.getCVImagePrediction(formData).subscribe({
      next: (res) => {
        // Start polling using the file name returned by backend
        this._AIService.pollForProcessedImageCV(file).subscribe({
          next: (blob: Blob) => {
            this.imageUrl = URL.createObjectURL(blob);
            this.loading = false;
            this.isStreaming = false;
            this.isSelectedFileImageOrVideo = false;
          },
          error: (err) => {
            this.fileImageErrorMessage =
              err.error?.error || 'An unknown error occurred';
            this.selectedFileImage = null;
            this.selectedFileImageName = 'No file chosen';
            if (this.inputimage) {
              this.inputimage.value = '';
            }
            if (this.inputvideo) {
              this.inputvideo.value = '';
            }
            this.loading = false;
            this.isStreaming = false;
            this.isSelectedFileImageOrVideo = false;
            // Revoke after some delay to allow the image to load
            setTimeout(() => {
              if (this.ImageObjectURL) {
                URL.revokeObjectURL(this.ImageObjectURL); // clean up
              }
            }, 1000); // Delay to allow image load
          },
          complete: () => {
            if (this.inputimage) {
              this.inputimage.value = '';
            }
            if (this.inputvideo) {
              this.inputvideo.value = '';
            }
            // Revoke after some delay to allow the image to load
            setTimeout(() => {
              if (this.ImageObjectURL) {
                URL.revokeObjectURL(this.ImageObjectURL); // clean up
              }
            }, 1000); // Delay to allow image load
          },
        });
      },
      error: (err) => {
        this.fileImageErrorMessage =
          err.error?.error || 'An unknown error occurred';
        this.selectedFileImage = null;
        this.selectedFileImageName = 'No file chosen';
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        this.loading = false;
        this.isStreaming = false;
        this.isSelectedFileImageOrVideo = false;
        // Revoke after some delay to allow the image to load
        setTimeout(() => {
          if (this.ImageObjectURL) {
            URL.revokeObjectURL(this.ImageObjectURL); // clean up
          }
        }, 1000); // Delay to allow image load
      },
      complete: () => {
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        // Revoke after some delay to allow the image to load
        setTimeout(() => {
          if (this.ImageObjectURL) {
            URL.revokeObjectURL(this.ImageObjectURL); // clean up
          }
        }, 1000); // Delay to allow image load
      },
    });
  }

  countdown: number = 120;
  timerInterval: any = null;

  startTimer(): void {
    const endTime = Date.now() + 120000;
    localStorage.setItem('video_timer_end', endTime.toString());
    this.updateCountdown(); // call immediately
    this.timerInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const endTime = Number(localStorage.getItem('video_timer_end') || 0);
    const timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    this.countdown = timeLeft;
    if (timeLeft <= 0) {
      this.stopTimer();
      this.isSelectedFileVideo = false;
      localStorage.removeItem('video_timer_end');
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isSelectedFileVideo = false;
      this.countdown = 120;
      this.timerInterval = null;
    }
  }

  onFileVideoSelected(event: any): void {
    if (
      this.isStreaming ||
      this.isSelectedFileImageOrVideo ||
      this.isSelectedFileVideo
    ) {
      return;
    }
    this.isSelectedFileImageOrVideo = true;
    this.isSelectedFileVideo = true;
    const input = event.target as HTMLInputElement;
    this.inputvideo = input;
    if (input.files && input.files.length > 0) {
      this.selectedFileImage = null;
      this.selectedFileImageName = 'No file chosen';
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null; // optional: prevent double revoke
      }
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
        this.videoUrl = null;
      }
      this.fileImageErrorMessage = null;
      if (input.files.length > 1) {
        this.loading = false;
        this.isStreaming = false;
        this.fileVideoErrorMessage = 'Only one file can be uploaded at a time.';
        this.selectedFileVideo = null;
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        this.selectedFileVideoName = 'No file chosen';
        return;
      }
      this.loading = true;
      this.isStreaming = true;
      const file = input.files[0];
      this.handleFileVideoUpload(file);
    } else {
      this.selectedFileVideoName = 'No file chosen';
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
    }
    // Reset the input to allow selecting the same file again
    setTimeout(() => {
      if (this.inputvideo) {
        this.inputvideo.value = '';
      } // Reset the input value to allow selecting the same file
    }, 100); // Small delay before resetting to allow the browser to process the change event
  }

  handleFileVideoUpload(file: File): void {
    const validTypes = ['video/mp4', 'video/webm'];
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (!validTypes.includes(file.type)) {
      this.loading = false;
      this.isStreaming = false;
      this.fileVideoErrorMessage = 'Only MP4 or WebM videos are allowed.';
      this.selectedFileVideo = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileVideoName = 'No file chosen';
      return;
    }
    if (file.size > maxSize) {
      this.loading = false;
      this.isStreaming = false;
      this.fileVideoErrorMessage = 'File size must not exceed 20MB.';
      this.selectedFileVideo = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileVideoName = 'No file chosen';
      return;
    }
    this.VideoObjectURL = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src); // free memory
      // Optional dimension check
      if (video.videoWidth > 1920 || video.videoHeight > 1080) {
        this.loading = false;
        this.isStreaming = false;
        this.fileVideoErrorMessage =
          'Video resolution must not exceed 1920x1080.';
        this.selectedFileVideo = null;
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        this.selectedFileVideoName = 'No file chosen';
      } else {
        this.loading = true;
        this.isStreaming = true;
        this.fileVideoErrorMessage = null;
        this.selectedFileVideo = file;
        this.selectedFileVideoName = file.name;
        this.uploadVideo(this.selectedFileVideo);
      }
    };
    video.onerror = () => {
      this.loading = false;
      this.isStreaming = false;
      this.fileVideoErrorMessage =
        'Error loading video. Please try a different file.';
      this.selectedFileVideo = null;
      if (this.inputimage) {
        this.inputimage.value = '';
      }
      if (this.inputvideo) {
        this.inputvideo.value = '';
      }
      this.selectedFileVideoName = 'No file chosen';
      URL.revokeObjectURL(this.VideoObjectURL); // clean up on error
    };
    video.src = this.VideoObjectURL;
  }

  uploadVideo(file: File): void {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.loading = true;
    this.isStreaming = true;
    this._AIService.getCVVideoPredection(formData).subscribe({
      next: (res: any) => {
        this._AIService.pollForProcessedVideoCV(file).subscribe({
          next: (res: Blob) => {
            this.videoUrl = URL.createObjectURL(res); // For preview
            this.loading = false;
            this.isStreaming = false;
            this.isSelectedFileImageOrVideo = false;
            this.startTimer(); // Start the timer
            setTimeout(() => {
              this.isSelectedFileVideo = false;
              this.stopTimer(); // Stop timer when done
              localStorage.removeItem('video_timer_end');
              this.countdown = 120;
            }, 120000);
          },
          error: (err) => {
            this.fileVideoErrorMessage =
              err.error?.error || 'An unknown error occurred';
            this.selectedFileVideo = null;
            this.selectedFileVideoName = 'No file chosen';
            if (this.inputimage) {
              this.inputimage.value = '';
            }
            if (this.inputvideo) {
              this.inputvideo.value = '';
            }
            console.error('Video Upload Error:', err.error);
            this.loading = false;
            this.isStreaming = false;
            this.isSelectedFileImageOrVideo = false;
            setTimeout(() => {
              if (this.VideoObjectURL) {
                URL.revokeObjectURL(this.VideoObjectURL); // Clean up preview blob
              }
            }, 1000);
          },
          complete: () => {
            if (this.inputimage) {
              this.inputimage.value = '';
            }
            if (this.inputvideo) {
              this.inputvideo.value = '';
            }
            setTimeout(() => {
              if (this.VideoObjectURL) {
                URL.revokeObjectURL(this.VideoObjectURL); // Clean up preview blob
              }
            }, 1000);
          },
        });
      },
      error: (err) => {
        this.fileVideoErrorMessage =
          err.error?.error || 'An unknown error occurred';
        this.selectedFileVideo = null;
        this.selectedFileVideoName = 'No file chosen';
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        console.error('Video Upload Error:', err.error);
        this.loading = false;
        this.isStreaming = false;
        this.isSelectedFileImageOrVideo = false;
        setTimeout(() => {
          if (this.VideoObjectURL) {
            URL.revokeObjectURL(this.VideoObjectURL); // Clean up preview blob
          }
        }, 1000);
      },
      complete: () => {
        if (this.inputimage) {
          this.inputimage.value = '';
        }
        if (this.inputvideo) {
          this.inputvideo.value = '';
        }
        setTimeout(() => {
          if (this.VideoObjectURL) {
            URL.revokeObjectURL(this.VideoObjectURL); // Clean up preview blob
          }
        }, 1000);
      },
    });
  }

  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('annotated_image', { static: false })
  annotated_image!: ElementRef<HTMLImageElement>;
  isStreaming: boolean = false; // To track if webcam is active
  framUrl: any;
  frameIntervalId: any = null;
  isProcessing = false;
  isToggleDisabled: boolean = false;
  isStartLive: boolean = false;
  private ws: WebSocket | null = null;

  connectToWebSocket(): void {
    this.ws = new WebSocket('ws://localhost:5001/plants/WeedDetection/predict-frame');
    // this.ws = new WebSocket('ws://localhost:5001/WeedDetection/predict-frame');
    //!! this.ws = new WebSocket('wss://localhost:5001/WeedDetection/predict-frame');
    //?? this.ws = new WebSocket("wss://definitely-normal-viper.ngrok-free.app/WeedDetection/predict-frame");
    this.ws.binaryType = 'arraybuffer'; // Ensure binary data
    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
      this.captureFrame();
    };
    this.ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' });
      if (this.framUrl) URL.revokeObjectURL(this.framUrl);
      this.framUrl = URL.createObjectURL(blob);
      this.annotated_image.nativeElement.src = this.framUrl;
      this.isProcessing = false;
    };
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isProcessing = false;
    };
    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.isProcessing = false;
      this.ws = null;
    };
  }

  // Method to toggle webcam streaming
  toggleWebcam(): void {
    if (this.isSelectedFileImageOrVideo) {
      return;
    }
    this.isToggleDisabled = true;
    if (this.isStreaming) {
      setTimeout(() => {
        this.isToggleDisabled = false; // Re-enable button after action completes
      }, 2500);
      this.isStartLive = false;
      this.stopWebcam();
    } else {
      setTimeout(() => {
        this.isToggleDisabled = false; // Re-enable button after action completes
      }, 5000);
      this.setupWebcam();
      this.isStartLive = true;
    }
  }

  // Method to start webcam
  async setupWebcam() {
    this.loading = true;
  
    // Reset UI/File inputs
    this.selectedFileImage = null;
    this.selectedFileImageName = 'No file chosen';
    this.fileImageErrorMessage = null;
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
    }
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
      this.videoUrl = null;
    }
    this.selectedFileVideo = null;
    this.selectedFileVideoName = 'No file chosen';
    this.fileVideoErrorMessage = null;
  
    try {
      // 1. Try environment/back camera
      const backStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      });
      this.handleStream(backStream);
      return;
    } catch (err) {
      console.warn('Back camera not available. Checking for specific devices...');
    }
  
    try {
      // 2. List available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
  
      if (videoDevices.length === 0) {
        console.error('No video input devices found.');
        this.loading = false;
        return;
      }
  
      // 3. Try to select DroidCam first
      let preferredCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes('droid')
      );
  
      // 4. Fallback to first available (usually laptop cam)
      if (!preferredCamera) {
        console.log('DroidCam not found. Using default laptop camera.');
        preferredCamera = videoDevices[0];
      }
  
      // 5. Request camera using deviceId
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: preferredCamera.deviceId } }
      });
  
      this.handleStream(stream);
    } catch (error) {
      // 6. Final fallback: basic access
      try {
        console.warn('Preferred camera not accessible. Trying generic fallback.');
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.handleStream(fallbackStream);
      } catch (fallbackError) {
        console.error('Could not access any camera:', fallbackError);
        this.loading = false;
      }
    }
  }
  private handleStream(stream: MediaStream): void {
    this.videoElement.nativeElement.srcObject = stream;
    this.videoElement.nativeElement.play();
    this.isStreaming = true;
    this.connectToWebSocket();
    this.loading = false;
  }

  // Method to stop webcam
  stopWebcam(): void {
    this.loading = false;
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    this.videoElement.nativeElement.srcObject = null;
    this.isStreaming = false;
    if (this.frameIntervalId) {
      clearInterval(this.frameIntervalId);
      this.frameIntervalId = null;
    }
    // Optionally clear canvas and image preview
    const context = this.canvasElement.nativeElement.getContext('2d');
    context?.clearRect(
      0,
      0,
      this.canvasElement.nativeElement.width,
      this.canvasElement.nativeElement.height
    );
    if (this.framUrl) {
      URL.revokeObjectURL(this.framUrl);
      this.framUrl = null;
    }
    this.annotated_image.nativeElement.src = '';
    // 🔌 Disconnect WebSocket
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Method to capture frames from the webcam
  captureFrame(): void {
    if (this.frameIntervalId) return; // Avoid multiple intervals
    this.frameIntervalId = setInterval(() => {
      if (!this.isStreaming || this.isProcessing) return;
      this.isProcessing = true;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d')!;
      const video = this.videoElement.nativeElement;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            this.isProcessing = false;
            return;
          }
          console.log('📤 Sending frame', blob.size, 'bytes');
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(blob);
          }          
        },
        'image/jpeg',
        0.7
      );
    }, 300); // 300ms is more reasonable than 10ms
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
    if (this.framUrl) {
      URL.revokeObjectURL(this.framUrl);
    }
    this.stopWebcam();
  }
}
