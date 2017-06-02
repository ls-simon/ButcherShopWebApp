function printpdf(id) {
    $.getJSON("/bestilling/" + id).done(function (data) {
        if (data[0] != undefined) {

            var doc = new jsPDF('p', 'pt');

            var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAYABgAAD/4QCURXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEyAAIAAAAUAAAATodpAAQAAAABAAAAYgAAAAAAAAEsAAAAAQAAASwAAAABMjAxNzowNToxMSAxODoxNDowNwAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAZKADAAQAAAABAAAAQAAAAAD/4QlvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wOk1vZGlmeURhdGU9IjIwMTctMDUtMTFUMTg6MTQ6MDciLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/wAARCABAAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QA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';

            var bestillingsLinjer = [];
            var totalPris = 0;

            for (var i = 0; i < data[0].bestillingLinjer.length; i++) {
                var samletPris = data[0].bestillingLinjer[i].antal * data[0].bestillingLinjer[i].pris;
                var vare;
                if (vare == null) {
                    vare = "er slettet"
                } else {
                    vare = data[0].bestillingLinjer[i].antal + " " + data[0].bestillingLinjer[i].vare.enhed + " " + data[0].bestillingLinjer[i].vare.navn;
                }
                bestillingsLinjer.push({
                    vare: vare,
                    kommentar: data[0].bestillingLinjer[i].kommentar,
                    pris: data[0].bestillingLinjer[i].pris,
                    samletPris: samletPris.toFixed(2)
                });
                totalPris += samletPris;
            }


            doc.setFontSize(25);
            doc.text(40, 50, "Følgeseddel");
            doc.addImage(imgData, 'JPEG', 460, 25, 100, 64);

            doc.setFontSize(10);
            doc.text("Kunde: " + data[0].kundeNavn, 40, 80);
            doc.text("Adresse: " + data[0].kundeAdresse, 40, 95);
            doc.text("Tlf: " + data[0].kundeTlf, 40, 110);

            doc.text("Slagteren i Højslev", 470, 115);
            doc.text("Østerrisvej 2", 470, 130);
            doc.text("7840 Højslev" , 470, 145);
            doc.text("CVR: 29943540", 470, 160);

            doc.setFontType("bold");
            doc.text("Kommentar", 40, 160);
            var splitTitle = doc.splitTextToSize(data[0].kommentar, 300);

            doc.setFontType("normal");
            doc.text(40, 180, splitTitle);
            doc.setFontType("normal");

            var overskrifter = [
                {title: "Vare", dataKey: "vare"},
                {title: "Kommentar", dataKey: "kommentar"},
                {title: "Enhedspris", dataKey: "pris"},
                {title: "Pris", dataKey: "samletPris", align: "right"}
            ];

            doc.autoTable(overskrifter, bestillingsLinjer, {
                startY: 250, showHeader: 'firstPage', columnStyles: {
                    vare: {columnWidth: 150},
                    kommentar: {columnWidth: 200},
                    pris: {columnWidth: 100},
                    samletPris: {columnWidth: 70}
                },
                styles: {fillColor: [224, 224, 224]}
            });


            doc.text("Total incl. moms: " + totalPris.toFixed(2), 415, doc.autoTable.previous.finalY + 15);

            doc.autoPrint();
            doc.output('dataurlnewwindow');

        }
    }).fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    });

}