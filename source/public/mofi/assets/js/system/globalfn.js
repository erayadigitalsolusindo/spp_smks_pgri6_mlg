function convertBulanToNumeric(selectedBulan){
    console.log(selectedBulan);
    const bulanToKode = {
        'januari': '1',
        'februari': '2', 
        'maret': '3',
        'april': '4',
        'mei': '5',
        'juni': '6',
        'juli': '7',
        'agustus': '8',
        'september': '9',
        'oktober': '10',
        'november': '11',
        'desember': '12'
    };
    let kodeBulan = selectedBulan.map(bulan => bulanToKode[bulan.toLowerCase()]);
    return kodeBulan;
}
function convertNumericToBulan(kodeBulan){
    const kodeBulanToNama = {
        '1': 'Januari',
        '2': 'Februari',
        '3': 'Maret',
        '4': 'April',
        '5': 'Mei',
        '6': 'Juni',
        '7': 'Juli',
        '8': 'Agustus',
        '9': 'September',
        '10': 'Oktober',
        '11': 'November',
        '12': 'Desember'
    }
    return kodeBulan.map(kode => kodeBulanToNama[kode]);
}