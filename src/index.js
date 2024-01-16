import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'tachyons';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
// import React, { useState, useEffect } from 'react';
// import { Container, Row } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import { AiOutlineDownload } from 'react-icons/ai';

// import offerLetterPdf from '../image/Offer_Letter.pdf'; // Replace with the correct path to your offer letter PDF

// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const OfferLetter = () => {
//   const [width, setWidth] = useState(1200);

//   useEffect(() => {
//     setWidth(window.innerWidth);
//   }, []);

//   return (
//     <div>
//       <Container fluid className="resume-section">
//         {/* Particle component was here */}
        
//         <Row className="resume">
//           <Document file={offerLetterPdf} className="d-flex justify-content-center">
//             <Page pageNumber={1} scale={width > 786 ? 1.7 : 0.6} />
//           </Document>
//         </Row>

//         <Row style={{ justifyContent: 'center', position: 'relative' }}>
//           <Button variant="primary" href={offerLetterPdf} target="_blank" style={{ maxWidth: '250px' }}>
//             <AiOutlineDownload />
//             &nbsp;Download Offer Letter
//           </Button>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default OfferLetter;
