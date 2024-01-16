import React, { useState, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import './OfferLetter.css'; // Import your CSS file

function OfferLetter() {
  const [offerLetterSrcs, setOfferLetterSrcs] = useState([]);

  useEffect(() => {
    const fetchAcceptedInterns = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/internship/acceptEachUser', {
          headers: {
            'auth-token': localStorage.getItem('authtoken'),
            'Authorization': 'Bearer yourToken',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data.data)
        if (data.success) {
          setOfferLetterSrcs(data.data.map((intern, index) => generateOfferLetterSrc(intern, index)));
        } else {
          console.error('Error fetching accepted interns:', data.error);
        }
      } catch (error) {
        console.error('Error fetching accepted interns:', error);
      }
    };

    fetchAcceptedInterns();
  }, []);

  const generateOfferLetterSrc = async (acceptedIntern, index) => {
    try {
      if (!acceptedIntern) {
        console.error('Accepted intern is undefined:', acceptedIntern);
        return; // Exit early if acceptedIntern is undefined
      }

      // Load the existing PDF based on domain
      const offerLetterModule = await import(`../../image/${acceptedIntern.domain}.pdf`);
      const existingPdfBytes = await fetch(offerLetterModule.default).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Access the first page of the PDF
      const page = pdfDoc.getPage(0);

      // Set font and font size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.setFont(font);

      // Set text color and position
      const dummyDetails = {
        // Use acceptedIntern data where needed in the offer letter
        name: acceptedIntern.name || 'John Doe',
        position: acceptedIntern.domain || 'Web Development',
        startDate: acceptedIntern.startDate ? new Date(acceptedIntern.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'January 1, 2023',
        endDate: acceptedIntern.endDate ? new Date(acceptedIntern.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'April 1, 2023',
        offerLetterDate: "1/3/2005",
        domain: acceptedIntern.domain || 'web dev interns',
        id: acceptedIntern.user || 'mitradanaa',
        // Add other details as needed
      };

      const startDateX = 212; // X-coordinate for startDate
      const startDateTextWidth = font.widthOfTextAtSize(dummyDetails.startDate, 11); // Calculate the width of startDate text

      page.drawText(` ${dummyDetails.name}`, { x: 65, y: 547.4, size: 11, color: rgb(0, 0, 0) });
      page.drawText(` ${dummyDetails.position}`, { x: 150, y: 463, size: 11, color: rgb(1, 0, 0) });
      page.drawText(` ${dummyDetails.startDate} To`, { x: 212, y: 436, size: 11, color: rgb(1, 0, 0) });
      page.drawText(` ${dummyDetails.domain} `, { x: 45, y: 504, size: 11, color: rgb(1, 0, 0) });
      page.drawText(` ${dummyDetails.offerLetterDate} `, { x: 61, y: 650, size: 11, color: rgb(1, 0, 0) });

      if(acceptedIntern.domain === "HR") {
        page.drawText(` intern in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 65, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "web development") {
          page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 137, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "Data Science") {
        page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 116, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "Artificial Intelligence") {
        page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 147, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "Social Media Marketing") {
        page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 166, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "Digital Marketing") {
        page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 133, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      else if(acceptedIntern.domain === "Machine Learning") {
        page.drawText(`in our NGO - “Suvidha Mahila Mandal”, with the following terms and conditions.`, { x: 137, y: 504, size: 11, color: rgb(0, 0, 0) });
      }
      // Add other conditions for different domains

      const endDateX = startDateX + startDateTextWidth + 5; // Add 5 for spacing

      page.drawText(` ${dummyDetails.endDate}`, { x: endDateX + 14, y: 436, size: 11, color: rgb(1, 0, 0) });
      page.drawText(` ${dummyDetails.id}`, { x: 465, y: 650, size: 11, color: rgb(1, 0, 0) });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();

      // Convert modified PDF bytes to data URL
      const modifiedPdfDataUrl = URL.createObjectURL(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));

      // Store the modified PDF source
      setOfferLetterSrcs((prevOfferLetterSrcs) => [...prevOfferLetterSrcs, { src: modifiedPdfDataUrl, details: dummyDetails }]);
    } catch (error) {
      console.error('Error updating offer letter:', error);
    }
  };
 

  
  const handleDownload = (index) => {
    const a = document.createElement('a');
    a.href = offerLetterSrcs[index]?.src || '';
    
    // Extract domain from the offerLetter details
    const domain = offerLetterSrcs[index]?.details?.domain || 'Offer_Letter';
  
    a.download = `${domain}.pdf`;
    a.click();
  };

  if (offerLetterSrcs.length === 0) {
    return (
      <div>
        { /* Display a message if offerLetterSrcs is empty */ }
        { /* You can customize this message based on your requirements */ }
        <p>You have not applied for the internship or your application is not approved by the Suvidha Foundation. Stay tuned for updates.</p>
      </div>
    );
  }

  return (
    <div className="offer-letter-container">
      {/* Display the modified offer letters with download buttons */}
      {offerLetterSrcs.length === 0 ? (
        <div>
          {/* Your code to run when no offer letter cards are shown */}
          {console.log("No offer letter cards are shown on the page.")}
          <p>You have not applied for the internship or your application is not approved by the Suvidha Foundation. Stay tuned for updates.</p>
        </div>
      ) : (
        offerLetterSrcs.map((offerLetter, index) => (
          index > 0 && (
            <div key={index} className="offer-letter-card">
              <p className="domain">{offerLetter.details?.domain}</p>
              <button className="download-button" onClick={() => handleDownload(index)}>
                Download Offer Letter
              </button>
            </div>
          )
        ))
      )}
    </div>
  );
  
}

export default OfferLetter;
