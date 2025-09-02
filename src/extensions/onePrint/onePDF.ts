import jsPDF from "jspdf";
import THSarabun from './assets/fonts/Sarabun/THSarabun.ttf';
import THSarabun_Bold from './assets/fonts/Sarabun/THSarabun_Bold.ttf';
//import * as path from 'path';
//import * as fs from 'fs';
//import { samplesDir } from '@microsoft/sp-core-library';




function b64toBlob(b64Data: string, contentType: string): Blob {
    const byteCharacters = atob(b64Data)
    
    const byteArrays = []
    //let byteNumbers : number[]
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512),
            byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
    
        byteArrays.push(byteArray)
    }
    
    const blob = new Blob(byteArrays, { type: contentType })
    return blob
}

const doc = new jsPDF("p", "mm", "a4");

export async function makePDF(): Promise<string> {
    doc.addFont(THSarabun, 'THSarabun', 'normal');
    doc.addFont(THSarabun_Bold, 'THSarabun_Bold', 'bold');
    doc.setFont('THSarabun','normal');


    
    

    //const width: number = doc.internal.pageSize.getWidth();
    //const height: number = doc.internal.pageSize.getHeight();



    //doc.setFontType("normal");
    doc.setFontSize(14);
    doc.text("Hello Everyone ฉันคือ", 130, 60); //อายุ check จาก ward ถ้าเป็นผู้ป่วยใน



    //const buff = string.substring(51);

    const string = await btoa(doc.output());
    const objectURL = await URL.createObjectURL(b64toBlob(string, 'application/pdf')) + '#toolbar=0'; //&navpanes=0&scrollbar=0
    //const preview_pdf = await "<embed  class='pdf-object' type='application/pdf' style='width:100%;height:500px;' src='" + objectURL + "'  /></embed >";
    //document.getElementById("preview_show").innerHTML = await preview_pdf;


    console.log(objectURL);
    return doc.output('datauristring');
    
}

