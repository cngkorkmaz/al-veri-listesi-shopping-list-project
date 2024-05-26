//* DÜZENLEME SEÇENEKLERİ GLOBAL BÖLÜMÜ
let editFlag = false; //* Düzenleme modunda olup olmadığımızı belirtir.
let editElement; //* Düzenleme yapılan öğeyi temsil eder.
let editID = ""; //* Düzenleme yapılan öğenin benzersiz kimliği. Bu id ye göre düzenleme yapıcaz çünkü.

//* Gerekli HMTL elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list"); //* class olduğu için . ile seçmeyi unutma
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//! FONKSİYONLAR

//* Ekrana bildirim bastıracak fonksiyondur.
const displayAlert = (text, action) => {
  alert.textContent = text; //* alert classlı etiketin içerisini dışarıdan göndreilen parametre ile değiştirdik.
  alert.classList.add(`alert-${action}`); //* p etiketine literal template ile dinamik class ekledik.

  //* aşağıdaki kod çalıştırıldıktan 2 saniye sonra ekrandan başarıyla eklendi yazısını kaldırmaya yarıyor
  setTimeout(() => {
    alert.textContent = ""; //* p etiketininin için boş stringe çevirdik.
    alert.classList.remove(`alert-${action}`); //* Eklediğimiz classı kaldırdık.
  }, 2000);
};

//* VArsayılan değerlere dönderir.
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const addItem = (e) => {
  e.preventDefault(); //* Formun gönderilme olayında sayfanı yenilenmesini engeller.
  const value = grocery.value; //* İnputun içerisine girilen değeri aldık.
  const id = new Date().getTime().toString(); //* Benzersiz bir id oluşturduk. listeye girilecek değer

  //* Eğer inputun içi boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* YEni bir "article" öğesi oluştur.
    let attr = document.createAttribute("data-id"); //* Yeni bir veri kimliği oluştur
    attr.value = id; //* attribute in value suna tanımladığımız id değerini göndermiş olduk.
    element.setAttributeNode(attr); //* Oluşturduğumuz id yi data özellik olarak set ettik. creaAttribute ile oluşturulan data yı set ettik.yani gönderdik.
    element.classList.add("grocery-item"); //* article etiketine class ekledik

    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        </div>

    `;

    //* Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.Yani edit ve delete butonunda işlem yapabilmek için
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); //* Oluşturduğumuz article etiketini html'e ekledik. Yani artık listeye giriş yapıldığında altına ekleme yapılabiliyor.
    displayAlert("Başarıyla Eklenildi", "success");

    //* Varsayılan değerlere dönderecek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);


  } else if (value !== "" && editFlag) {
    //* soldaki durum düzenleme modunda olduğumuzu gösterir.
    editElement.innerHTML = value; //* Güncelleyeceğimiz elemanın içeriğini değiştirdik. Düzenlen değeri yani inputun yeni değerini aktarmaya yarar.
    displayAlert("Başarıyla Değiştirildi", "success");

    editLocalStore(editID, value)
    setBackToDefault();

    
  
  
  }
};

//* Silme butonuna tıklanıldığında çalışır.
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //* Sileceğimiz elemana kapsayıcıları vasıtası ile ulaştık.
  const id = element.dataset.id;
  console.log(element);
  list.removeChild(element); //* Bulduğumuz article etiketini list alanı içerisinden kaldırdık.yani listeye eklenen elemanı sildik.
  displayAlert("Başarıyla kaldırıldı", "danger"); //* Ekrana gönderdiğimiz parametrelere göre bildirim bastırır.

  removeFromLocalStorage(id)
};

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //* Düzenleme yapacağımız etiketi seçtik.
  grocery.value = editElement.innerText; //* Düzenlediğimiz etiketin içeriğini inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; //* Düzenlenen öğenin kimliğini(içeriğini) gönderdik.

  submitBtn.textContent = "Düzenle"; //* Düzenle butonuna tıklanıldığında Ekle butonu Düzenle olarak değişsin.
  console.log(editID);
};

//* Listeyi temizle butonu tıklandığında yapılacak işlemler
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  console.log(items);

  //* Listede article etiketi var mı?
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item)); //* foreach ile dizi içerisinde bulunan her bir elemanı dönüp her bir öğeyi listden kaldırdık.
   
  };   

  displayAlert("Liste Boş", "danger");
  localStorage.removeItem("list") //* Local storege temizleme komutu
};




//! YEREL DEPO LOCAL STORAGE BÖLÜMÜ
//* Yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
 const grocery = {id, value};

 let items = getLocalStorage();
 items.push(grocery);
 console.log(items);

 localStorage.setItem("list", JSON.stringify(items));

}


//* Yerel depodan ögeleri alma işlemi. Local storagedaki verileri getirme. 
function getLocalStorage () {
  return localStorage.getItem("list")
  //! ternary yapısı yani ? : soru işareti ve iki nokta yapısı if-else gibi bir yapı
  ? JSON.parse(localStorage.getItem("list"))
  : [];
}


//* Yerel depodan id sine göre silme işlemi. gönderdiğim id ye göre silme işlemi

const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items = items.filter((item) => item.id !== id );
    localStorage.setItem("list", JSON.stringify(items))
}

//* Yerel depo güncelleme işlemi
const editLocalStore = (id, value) => {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

//* Gönderilen id ve value(değer) sahip bir öğe oluşturan fonksiyon
const createListItem = (id, value) => {
  
  const element = document.createElement("article"); //* YEni bir "article" öğesi oluştur.
  let attr = document.createAttribute("data-id"); //* Yeni bir veri kimliği oluştur
  attr.value = id; //* attribute in value suna tanımladığımız id değerini göndermiş olduk.
  element.setAttributeNode(attr); //* Oluşturduğumuz id yi data özellik olarak set ettik. creaAttribute ile oluşturulan data yı set ettik.yani gönderdik.
  element.classList.add("grocery-item"); //* article etiketine class ekledik

  element.innerHTML = `
  <p class="title">${value}</p>
  <div class="btn-container">
      <button type="button" class="edit-btn">
          <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button type="button" class="delete-btn">
          <i class="fa-solid fa-trash"></i>
      </button>
      </div>

  `;

  //* Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.Yani edit ve delete butonunda işlem yapabilmek için
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  list.appendChild(element); //* Oluşturduğumuz article etiketini html'e ekledik. Yani artık listeye giriş yapıldığında altına ekleme yapılabiliyor.
  
} 


const setupItems = () => {

  let items = getLocalStorage();

 
  if (items.length > 0) {
    items.forEach((item) =>  {
      createListItem(item.id, item.value);
    });
  }  
};


//! OLAY İZLEYİCİLERİ

//*Form gönderildiğinde addItem sistemi çalışır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems) //* sayfa yüklendiği anda bir fnk. çalıştıracağım adı setupItems olsun
