import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

export async function generateOficio(investigacion, autoridad) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `Huancayo, ${new Date().toLocaleDateString()}`, break: 2 }),
              new TextRun(`Oficio N° ${investigacion.numero_oficio}`),
              new TextRun(`\nReferencia: ${investigacion.numero_oficio_referencia}`),
              new TextRun(`\nAsunto: Evaluación de Tesis "${investigacion.titulo}"`),
              new TextRun(`\n\nDe mi especial consideración:`),
              new TextRun({
                text: `\nMe dirijo a usted para remitir la investigación titulada "${investigacion.titulo}", presentada por ${investigacion.autor}. El informe de similitud es del ${investigacion.porcentaje_similitud_oti}%.`,
                break: 1,
              }),
              new TextRun(`\nCódigo: ${investigacion.codigo}`),
              new TextRun(`\nGrado solicitado: ${investigacion.titulo_grado}`),
              new TextRun(`\nFacultad: ${investigacion.facultad}`),
              new TextRun(`\nRepositorio: ${investigacion.urllink}`),
              new TextRun(`\n\nSin otro particular, me despido con las consideraciones más distinguidas.`),
              new TextRun({
                text: `\n\n${autoridad.nombreapellidodecano}`,
                bold: true,
                break: 2,
              }),
              new TextRun(`${autoridad.grado}`),
              new TextRun(`\n${autoridad.denominacion}`),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Oficio_${investigacion.numero_oficio}.docx`);
}
