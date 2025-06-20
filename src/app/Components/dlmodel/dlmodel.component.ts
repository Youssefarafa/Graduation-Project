import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { AIService } from '../../core/services/ai.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-dlmodel',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './dlmodel.component.html',
  styleUrl: './dlmodel.component.scss',
  animations: [
    trigger('fadeInOut', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('hidden => visible', [animate('600ms ease-out')]),
      transition('visible => hidden', [animate('300ms ease-in')]),
    ]),
  ],
})
export class DLModelComponent implements OnInit,OnDestroy {
  selectedFile: any = null;
  selectedFileName: string | null = null;
  isDragging = false;
  isHovering = false;
  fileErrorMessage: string | null = null;
  loading = false;
  predictionResult: any = null;
  predictionResultLenght: number = 0;
  objectURL: any = null;
  showimage: any = null;

  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _AIService: AIService
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
        const savedData = localStorage.getItem('detectionResult');
        if (savedData) {
          this.predictionResult = JSON.parse(savedData);
          this.predictionResultLenght = Object.keys(
            this.predictionResult
          ).length;
          this.loadImage();
        }
      });
    }
  }

  async generatePDF() {
    if (
      !this.predictionResult ||
      !this.showimage ||
      this.predictionResultLenght <= 1
    ) {
      alert('Prediction result or image is not available!');
      return;
    }
    try {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      const pdfMake = (pdfMakeModule as any).default;
      pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;
      const base64Image = await this.convertBlobUrlToBase64(this.showimage);
      // Format treatment steps
      const treatmentLines: any[] = [];
      if (Array.isArray(this.predictionResult.treatment_steps)) {
        for (const item of this.predictionResult.treatment_steps) {
          treatmentLines.push(
            {
              text: item.step.replace('💪', '').replace('❤️‍🩹', ''),
              style: 'treatmentStep',
              margin: [0, 5, 0, 2],
            },
            {
              text:
                'Advice: ' +
                (item.advice ?? 'undefined').replace(
                  'undefined',
                  'there is no advice, you are great person.'
                ),
              style: 'treatmentAdvice',
              margin: [10, 0, 0, 5],
            }
          );
        }
      } else {
        treatmentLines.push({
          text: this.predictionResult.treatment_steps,
          style: 'tableCell',
          margin: [0, 5, 0, 5],
        });
      }
      const documentDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          margin: [40, 20],
          columns: [
            { text: 'Plant Disease Report', style: 'header' },
            {
              image: base64Image,
              width: 60,
              height: 60,
              alignment: 'right',
              margin: [0, 0, 40, 0],
            },
          ],
        },
        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            {
              text: `Generated on ${new Date().toLocaleDateString()}`,
              style: 'footerText',
            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'right',
              style: 'footerText',
            },
          ],
          margin: [40, 0],
        }),
        content: [
          { text: 'Prediction Summary', style: 'sectionHeader' },
          {
            style: 'resultTable',
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'Plant Name', style: 'tableHeader' },
                  {
                    text: this.predictionResult.plant_name,
                    style: 'tableCell',
                  },
                ],
                [
                  { text: 'Disease Name', style: 'tableHeader' },
                  {
                    text: this.predictionResult.disease_name,
                    style: 'tableCell',
                  },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex: number) =>
                rowIndex % 2 === 0 ? '#f3f3f3' : null,
              hLineColor: () => '#bbbbbb',
              vLineColor: () => '#bbbbbb',
            },
            margin: [0, 0, 0, 20],
          },
          {
            text: 'Treatment Steps',
            style: 'sectionHeader',
            margin: [0, 20, 0, 5],
          },
          ...treatmentLines,
          { text: 'Annotated Image', style: 'sectionHeader' },
          {
            image: base64Image,
            width: 180,
            // height: 150,
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
          {
            text: 'Disclaimer: This report is generated by an Napta system and should be used for guidance only.',
            style: 'disclaimer',
            margin: [0, 20, 0, 0],
          },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            color: '#006400', // Dark green
          },
          sectionHeader: {
            fontSize: 16,
            bold: true,
            color: '#228B22', // Forest green
            margin: [0, 10, 0, 5],
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            color: 'white',
            fillColor: '#228B22',
            margin: [5, 5, 5, 5],
          },
          tableCell: {
            fontSize: 12,
            margin: [5, 5, 5, 5],
          },
          resultTable: {
            margin: [0, 10],
          },
          treatmentStep: {
            fontSize: 12,
            bold: true,
            color: '#2E8B57',
          },
          treatmentAdvice: {
            fontSize: 11,
            italics: true,
            color: '#555555',
          },
          disclaimer: {
            fontSize: 10,
            italics: true,
            color: '#666666',
          },
          footerText: {
            fontSize: 8,
            color: '#999999',
          },
        },
        defaultStyle: {
          font: 'Roboto',
        },
      };
      pdfMake
        .createPdf(documentDefinition)
        .download('plant_disease_report.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed: ' + error);
    }
  }

  // ✅ Utility function: convert Blob URL to base64
  private async convertBlobUrlToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  handleFileUpload(file: File): void {
    const validTypes = ['image/png', 'image/jpeg'];
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (!validTypes.includes(file.type)) {
      this.fileErrorMessage = 'Only PNG or JPG images are allowed.';
      this.selectedFile = null;
      this.selectedFileName = null;
      return;
    }
    if (file.size > maxSize) {
      this.fileErrorMessage = 'File size must not exceed 3MB.';
      this.selectedFile = null;
      this.selectedFileName = null;
      return;
    }
    this.objectURL = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width > 1024 || img.height > 1024) {
        this.fileErrorMessage =
          'Image dimensions must be 1024x1024 pixels or smaller.';
        this.selectedFile = null;
        this.selectedFileName = null;
      } else {
        this.fileErrorMessage = null;
        this.selectedFile = file;
        this.selectedFileName = file.name;
      }
    };
    img.onerror = () => {
      this.fileErrorMessage =
        'Error loading image. Please try a different file.';
      this.selectedFile = null;
      this.selectedFileName = null;
      URL.revokeObjectURL(this.objectURL); // clean up on error
    };
    img.src = this.objectURL;
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (input.files.length > 1) {
        this.fileErrorMessage = 'Only one file can be uploaded at a time.';
        this.selectedFile = null;
        this.selectedFileName = null;
        return;
      }
      const file = input.files[0];
      this.handleFileUpload(file);
    } else {
      this.selectedFileName = null;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (files.length > 1) {
        this.fileErrorMessage = 'Only one file can be uploaded at a time.';
        this.selectedFile = null;
        this.selectedFileName = null;
        return;
      }
      const file = files[0];
      this.handleFileUpload(file);
    } else {
      this.selectedFileName = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy'; // ✔️ Allowed
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  blobToJson(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async saveImage() {
    const base64Image = await this.fileToBase64(this.selectedFile);
    localStorage.setItem('selectedImage', base64Image);
  }

  loadImage() {
    const base64Image = localStorage.getItem('selectedImage');
    if (base64Image) {
      this.showimage = base64Image;
    }
  }

  submitImage() {
    if (!this.selectedFile) return;
    this.predictionResult = null;
    this.predictionResultLenght = 0;
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.loading = true;
    this._AIService.getDLPredection(formData).subscribe({
      next: (res) => {
        // Start polling using the file name returned by backend
        this._AIService.pollForProcessedImageDL(this.selectedFile).subscribe({
          next: (blob: Blob) => {
            this.blobToJson(blob)
              .then((json) => {
                this.predictionResult = json;
                this.predictionResultLenght = Object.keys(
                  this.predictionResult
                ).length;
                localStorage.setItem('detectionResult', JSON.stringify(json));
                this.saveImage();
              })
              .catch((err) => console.error('❌ Failed to parse JSON:', err));
            this.showimage = URL.createObjectURL(this.selectedFile);
            this.loading = false;
          },
          error: (err) => {
            this.fileErrorMessage =
              err.error?.error || 'An unknown error occurred';
            console.error('Upload error:', err.error);
            this.loading = false;
            // Revoke after some delay to allow the image to load
            setTimeout(() => {
              if (this.objectURL) {
                URL.revokeObjectURL(this.objectURL); // clean up
              }
            }, 1000); // Delay to allow image load
          },
          complete: () => {
            console.log('Predict Disease fetching complete');
            // Revoke after some delay to allow the image to load
            setTimeout(() => {
              if (this.objectURL) {
                URL.revokeObjectURL(this.objectURL); // clean up
              }
            }, 1000); // Delay to allow image load
          },
        });
      },
      error: (err) => {
        this.fileErrorMessage = err.error?.error || 'An unknown error occurred';
        console.error('Upload error:', err.error);
        this.loading = false;
        // Revoke after some delay to allow the image to load
        setTimeout(() => {
          if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL); // clean up
          }
        }, 1000); // Delay to allow image load
      },
      complete: () => {
        console.log('Predict Disease fetching complete');
        // Revoke after some delay to allow the image to load
        setTimeout(() => {
          if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL); // clean up
          }
        }, 1000); // Delay to allow image load
      },
    });
  }
  ngOnDestroy() {
    if (localStorage.getItem('detectionResult')) {
      localStorage.removeItem('detectionResult');
    }
  }
}
