import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { LoginStatusService } from '../services/login-status.service';
import { ace_themes, allAceLanguages} from '../others'; 
import { ApiService } from '../services/api.service';
import { DocumentService } from '../document.service';
import { Router } from '@angular/router';

declare var ace: any;


@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css'
})
export class CodeEditorComponent implements AfterViewInit, OnInit, OnDestroy{
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef; //reference to the html element

  aceThemes: any = ace_themes;
  selectedThemeKey: string = 'Clouds'; // Store the selected key
  selectedThemeValue: string = ''; // Store the selected value

  documentCreated: boolean = false;

  code: string = ''; // Declare the code property here
  editor !: any;
  private isUpdatingEditor: boolean = false;

  aceLanguages : any = allAceLanguages;
  selectedLanguageKey: string = 'Javascript'; // Store the selected key
  selectedLanguageValue: string = ''; // Store the selected value

  private autoSaveTimer: any;

  constructor(private elementRef: ElementRef,
    private loginStatus : LoginStatusService,
    private renderer: Renderer2,
    private router : Router,
    private documentService: DocumentService,
    private apiService : ApiService)
  {
      // Initial check
      this.loginStatus.checkLoginStatus(router);
  
  }

  ngOnInit(){
    this.documentService.intialDoc$.subscribe((response)=> {
      if(this.editor && this.editor.getValue() == ""){
        this.editor.setValue(response)
        console.log("initial sub")
      }
    })

    this.documentService.documentUpdate$.subscribe((updateDocument) => {
      if (this.editor && !this.isUpdatingEditor) {
        const currentPosition = this.editor.getCursorPosition();
        this.isUpdatingEditor = true;
        console.log("doc sub")
  
        // Check if the updateDocument is different from the current editor content
        if (updateDocument !== this.editor.getValue()) {
          this.editor.setValue(updateDocument, currentPosition); // Set the updated document and cursor position
        }
        this.isUpdatingEditor = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the timer subscription to avoid memory leaks

  }

  ngAfterViewInit(): void {
    // Delay Ace Editor initialization
    setTimeout(() => {
      const editorElement = this.elementRef.nativeElement.querySelector('#editor');

      this.renderer.setStyle(editorElement, 'height', '500px');

      this.editor = ace.edit(editorElement);
      this.updateEditorTheme(this.editor);
      this.updateEditorMode(this.editor);
      this.editor.session.setMode('ace/mode/javascript');

      if (this.editor && this.editor.getValue() == "") {
        this.documentService.intialDoc$.subscribe(response => {
          this.editor.setValue(response)
        })
      }


      this.editor.session.on('change', () => {
        if(!this.isUpdatingEditor){
          const updatedCode = this.editor.getValue();
          this.code = updatedCode;
          this.documentService.broadcastDocumentUpdate(this.code);
          // Start or reset the auto-save timer when the document is changed
          //this.startAutoSaveTimer();
        }
      });  
      this.editor.session.selection.on('changeCursor', (e: any) => {
        const cursorPosition = this.editor.getCursorPosition();

      }); 
    });
  }

  sendCode() {
    // Check if the document is already created in the database
    if (!this.documentCreated) {
      // If not created, perform an insert operation
      this.apiService.insertCodeToSql("TESTT", this.code).subscribe(resp => {
        console.log(resp);
        this.documentCreated = true;  // Mark the document as created
      }, err => {
        console.log(err);
      });
    } else {
      // If already created, perform an update operation
      this.apiService.updateCodeToSql("TESTT", this.code).subscribe(resp => {
        console.log(resp);
      }, err => {
        console.log(err);
      });
    }
  }


  //Changing the theme of code editor
  onThemeChange(): void {
    this.selectedThemeValue = this.aceThemes[this.selectedThemeKey];
    console.log('Selected Theme:', this.selectedThemeValue);

    const editor = ace.edit('editor');
    this.updateEditorTheme(editor);
  }

  //Changing the language of code editor
  onLanguageChange(){
    this.selectedLanguageValue = this.aceLanguages[this.selectedLanguageKey]
    console.log('Selected Language: ', this.selectedLanguageValue)

    const editor = ace.edit('editor');
    this.updateEditorMode(editor);
  }

  private updateEditorTheme(editor: any): void {
    editor.setTheme(`ace/theme/${this.selectedThemeValue}`);
  }
  
  private updateEditorMode(editor: any): void {
    const mode = `ace/mode/${this.selectedLanguageValue}`;
    editor.session.setMode(mode);
  }

  getObjectKeys(obj : any): string[] {
    return Object.keys(obj);
  }






}
