import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilesService} from '../../services/files.service';
import {HttpEventType, HttpResponse, HttpUploadProgressEvent} from '@angular/common/http';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();
  progress = -1;
  images: string[] = [];

  constructor(private backend: FilesService) {
  }

  ngOnInit(): void {
    this.backend.getUploads().subscribe(imgs => {
      console.log(imgs);
      this.images = imgs;
    });
  }

  click(img: string) {
    this.selectedChange.emit(img);
  }

  handleFileInput(files: FileList, field: HTMLInputElement) {
    this.progress = 0.0;
    field.disabled = true;

    this.backend.uploadFile(files.item(0)).subscribe(httpEvent => {
      switch (httpEvent.type) {
        case HttpEventType.UploadProgress:
          const p = (httpEvent as HttpUploadProgressEvent);
          this.progress = p.loaded / p.total;
          console.log('Upload progress: ' + p.loaded + '/' + p.total);
          break;

        case HttpEventType.Response:
          const res = (httpEvent as HttpResponse<string>);
          console.log('Upload success ' + res.body);
          this.progress = -1;
          field.value = '';
          this.images.push(res.body);
          this.click(res.body);
          field.disabled = false;
          break;
        default:
          console.log('Ignore http event');
          console.log(httpEvent);
      }
    });
  }
}
