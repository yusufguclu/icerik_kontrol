Proje Özeti

EtiketKontrol, paketli gıda ürünlerinin etiketlerini otomatik olarak analiz eden bir mobil uygulamadır.
Kullanıcı, ürünün içindekiler bölümünün fotoğrafını çeker; sistem bu görüntüyü otomatik olarak metne dönüştürür ve içeriği analiz eder.

Uygulama, kullanıcının belirlediği alerji, diyet tercihleri ve zararlı içerik hassasiyetlerine göre ürünü değerlendirir ve sonucu anlaşılır uyarılar ile sunar. Böylece kullanıcı, teknik terimler arasında kaybolmadan ürünün kendisi için uygun olup olmadığını hızlıca anlayabilir.

EtiketKontrol, manuel metin girişi gerektirmez ve alışveriş sırasında bilinçli ve güvenli kararlar alınmasını hedefler.
Problem Tanımı

Paketli gıdaların etiketleri:

Küçük yazılıdır

Teknik terimler içerir

Hızlı alışveriş sırasında çoğu zaman okunmaz

Bu durum özellikle:

Alerjisi olan bireyler

Belirli içeriklerden kaçınmak isteyen kullanıcılar
için sağlık riski oluşturmaktadır.

Mevcut çözümler çoğunlukla barkod veya statik veri tabanlarına dayanır ve kişisel hassasiyetleri yeterince dikkate almaz.

Çözüm Yaklaşımı

EtiketKontrol, fotoğraf tabanlı bir yaklaşımla çalışır:

Kullanıcı alerji/hassasiyetlerini seçer

Ürün etiketinin fotoğrafını çeker veya galeriden seçer

Sistem OCR ile etiketteki yazıyı metne çevirir

İçerik analizi yapılır

Sonuç kullanıcıya sade ve net şekilde sunulur

Sonuçlar üç seviyede gösterilir:

🚨 Alerji riski (kırmızı)

⚠️ Dikkat edilmesi gereken içerikler (sarı)

✅ Genel olarak uygun (yeşil)

Yapay Zekâ Kullanımı

Yapay zekâ, projede destekleyici ve açıklayıcı bir rol üstlenir.

AI’nın görevleri:

Etiket metnindeki içerikleri sade bir dille açıklamak

Katkı maddelerinin neden “dikkat gerektirdiğini” özetlemek

Kısa (2–3 cümle) kullanıcı dostu değerlendirme üretmek

AI’nın yapmadıkları:

Tıbbi teşhis koymaz

Kesin “zararlı” veya “zararsız” yargısı vermez

Güvenilirlik yaklaşımı:

Alerji eşleşmeleri kural tabanlıdır (kelime/ifade eşleşmesi)

AI, yalnızca açıklama ve bağlamsal yorum üretir.
OCR (Görüntüden Metne)

Etiket metninin çıkarılması için ücretsiz OCR çözümleri kullanılır.

Hedef:

Kullanıcıdan manuel yazı girişi beklememek

Fotoğraf → metin dönüşümünü otomatik yapmak

OCR hatalarında:

Kullanıcıya çıkarılan metni düzeltme imkânı verilir

Demo akışının bozulmaması sağlanır.
Teknik Mimari
Mobil Uygulama

React Native + Expo

Tek ekran MVP

Foto çekme / seçme

Sonuç kartları (renkli)

Backend

Node.js + Express

Tek ana endpoint: /analyze

Görevler:

Fotoğrafı almak

OCR ile metne çevirmek

Alerji eşleşmelerini kontrol etmek

AI’dan açıklama üretmek

Tek bir JSON cevap dönmek


not:kod kalitesine önem ver kodlar uygun sekilde düzenlenmıs ve okunabilir olmalı