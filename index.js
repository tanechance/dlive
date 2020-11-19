const axios=require("axios"); //Axios kütüphanesi
const cheerio=require("cheerio"); // Cheerio kütüphanesi
const express = require("express"); // Express kütüphanesi
const app = express(); // App diye sabit değişken tanımladık express modülünü dahil ederek.Aşağıda app.get için gerekli.
app.get('/',function(req,result){
  result.json({"hata":"Lütfen apiyi kullanmak için bir parametre gönderiniz şuan için live parametresi kullanılabilir."})
})
app.get("/live",function(req,result){
    if(!req.query.ara){
    result.json({"hata":"Lütfen bir yayıncı adı girin."})
  }
  axios.get(`https://dlive.tv/${req.query.ara}`).then(res=>{
    const $=cheerio.load(res.data) // Axios ile DLive üzerindeki bütün verileri çektik.
    var yayinciAdi=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.channel-header.flex-justify-between.flex-align-center.bg-grey-darken-5.paddinglr-4 > div.channel-header-left.flex-align-center > div.marginl-3.flex-column > div:nth-child(1) > span > span.overflow-ellipsis").text().trim() //Yayıncı adını içeren selector'u çekip metinsel ifadeye dönüştürdük.
    var yayinBaslik=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.livestream-info.bg-grey-darken-5 > div > div.info-line-left.flex-box > div.info-title.flex-column.flex-justify-center > div.text-14-medium.text-white.overflow-hidden").text().trim() //Yayın başlığını içeren selector'u çekip metinsel ifadeye dönüştürdük.
    var oynuyor=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.livestream-info.bg-grey-darken-5 > div > div.info-line-left.flex-box > div.info-title.flex-column.flex-justify-center > div.flex-box.text-blue.text-12-medium > a").text().trim() //Hangi oyunu oynadığını veya ne yayını yaptığını içeren selector'u çekip metinsel ifadeye dönüştürdük.
    var yayindami=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.channel-header.flex-justify-between.flex-align-center.bg-grey-darken-5.paddinglr-4 > div.channel-header-left.flex-align-center > div.marginl-3.flex-column > div:nth-child(2) > div.marginl-3 > div").text().trim() //Yayında mı? Değil mi? Olduğunu kontrol değerini çekip metinsel ifadeye dönüştürdük.
    var followers=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.channel-header.flex-justify-between.flex-align-center.bg-grey-darken-5.paddinglr-4 > div.channel-header-left.flex-align-center > div.marginl-3.flex-column > div:nth-child(1) > div.marginl-3 > span").text().replace("Followers · ","").trim() // Mevcut takipçilerini çektik ve replace komutu ile ingilizce olan Followers kısmını gizledik.Sadece sayısal veriyi aldık.
    var pp=$("#router-view > div > div > div.height-100.flex-auto.overflow-y-auto.flex-all-center.bg-grey-darken-6 > div > div.bg-grey-darken-5.mobile-page > div.channel-header.flex-justify-between.flex-align-center.bg-grey-darken-5.paddinglr-4 > div.channel-header-left.flex-align-center > div.position-relative > div").children('img').eq(0).attr('src');
    if(yayindami==""){
      //Eğer Yayında değilse yukarıdaki yayindami değişkeni boş dönecektir boş döneceği zaman boolean(evet-hayır veya doğru-yanlış olarak değerlendirilebilir burası False olursa hayır olarak değerlendirilir.)
      result.json({isLive:false}) //JSON formatında yayında olmadığını API'de belirttik.
    }
    //Eğer yayında değil seçeneği dönmez ise demek ki yayına girmiştir.
    else {
      //Yayına girdiği için JSON formatında gerekli bilgileri API sayfamıza yansıttık.
    result.json({
      streamerName:yayinciAdi,
      streamerTitle:yayinBaslik,
      streamerPhoto:pp,
      streamerFollower:followers,
      streamerPlaying:oynuyor,
      kacKisi:yayindami,
      isLive:true    
    })
    }
  })
})
app.listen(3000 || process.env.TOKEN ,()=>{console.log("API Hazır, 3000 portunda aktif olarak çalışıyor...")})
