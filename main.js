let news = [];
let page = 1;
let totalPages = 0;

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event)=>getNewsByTopic(event))
);
// 내가 어떤 버튼을 클릭했는지 확인하기 위해 event라는 매개변수를 넣어주었다

let searchBtn = document.getElementById("search-button");
let url = "";

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    console.log(url);
    //버튼을 누를 때마다 url 주소 뒤에 &page를 바꿔주며 넣어준다(동기)

    let response = await fetch(url);
    let data = await response.json();

    if (response.status === 200) {

      if (data.totalResults === 0) {
        pagination()
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("내가 받은 데이터", data);
      news = data.articles;
      totalPages = data.totalResults;

      render();
      pagination();

    } else {
      throw new Error(data.message);
      pagination();
    }

  } catch (error) {
    console.log("잡힌에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    "https://newsapi.org/v2/top-headlines?country=kr&apiKey=4c50b49d8b064d898d33de51bbb087b0&category=entertainment&pageSize=5"
  );

  // let header= new Headers({"x-api-key": "l2Psk6eIvFsCNpmD3TGb4Cs97JodsFyGRtQ8MJDnORs"})

  getNews();
};

//키워드별 검색
const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?apiKey=4c50b49d8b064d898d33de51bbb087b0&q=${keyword}&pageSize=5`
  );

  getNews();
};

//카테고리별 검색
const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent); //클릭되었을 때 event.target이 찍히는지 확인
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=4c50b49d8b064d898d33de51bbb087b0&pageSize=5&category=${topic}`
  );

  getNews();
};

// api에서 가져온 내용을 화면에 보여주기
const render = () => {
  let resultHTML = " ";
  resultHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${
          item.urlToImage ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }"
      />
    </div>

    <div class="col-lg-8">
      <h2>${item.title}</h2>
      
      <p>${item.description || "내용없음"}</p>
      
      <div>${item.source.name || "출처없음"} * ${moment(
        item.publishedAt
      ).fromNow()}</div>
    </div>

  </div>`;
    })
    .join("");

  // console.log(resultHTML);
  document.getElementById("news-board").innerHTML = resultHTML;
};

searchBtn.addEventListener("click", getNewsByKeyword);
//function함수가 아닌 화살표 함수 또는 변수 선언방식을 쓰면 호이스팅이 안되기 때문에, 순서가 중요하다.

getLatestNews();

//에러발생시 홈페이지에 보여줄 부분
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
 ${message}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

//페이지네이션 만들기
const pagination = () => {
  let paginationHTML = "";
  //totalPages: 총 전체의 페이지 수
  //page :현재 내가 위치해 있는 페이지
  //page group:개수별로 묶은 페이지의 그룹(Math.ceil를 통해 올림을 해준다 )
  let pageGroup = Math.ceil(page / 5);

  //last
  let last = pageGroup * 5;
 
  if(last>totalPages){
    last=totalPages;
  }

  //first
  let first = last - 4<=0 ? 1 : last - 4 ;

  //totalPageGroup
  let totalPageGroup=totalPages/5


  //first~last페이지 프린트
  if(first >=5){
    paginationHTML += `<li class="page-item ">
  <a class="page-link" href="#" aria-label="Previous" onclick='moveToPage(1)'>
    <span aria-hidden="true">&lt;&lt;</span>
  </a>
 </li><li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick='moveToPage(${page-1})'>
    <span aria-hidden="true">&lt;</span>
  </a>
 </li>`;
  }
    
  
  for (let i = first; i <= totalPageGroup; i++) {
       paginationHTML += `<li class="page-item ${page === i ? "active" : ""}">
       <a class="page-link" href="#" onclick='moveToPage(${i})'>${i}</a></li>`;
  }

  
    paginationHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${page+1})'>
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${totalPageGroup})'>
        <span aria-hidden="true">&gt;&gt;</span>
      </a>
    </li>`

  
  

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  console.log(page);
  getNews();
};

// 상단바 입력시 메뉴
let menuItem = document.querySelector(".menu-item");
let subBar = document.querySelector(".sub-bar");
let closeItem = document.querySelector(".close_item");
let inputBar = document.querySelector(".input-bar");
let btn = document.querySelectorAll(".button-bar button");

btn.forEach((item)=>
 item.addEventListener('click',(event)=>btnBar(event))
)

const btnBar=async(event)=>{
  
  let topic=event.target.textContent.toLowerCase();;
  console.log('btnBar는',topic)

  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=4c50b49d8b064d898d33de51bbb087b0&pageSize=5&category=${topic}`
  );

  getNews();

}

menuItem.addEventListener("click", function () {
  subBar.classList.add("show");
});

closeItem.addEventListener("click", function () {
  subBar.classList.remove("show");
});

// 검색창
let searchItem = document.querySelector(".search-item");
let isClicked = false;

searchItem.addEventListener("click", function () {
  isClicked = !isClicked;
  if (isClicked) {
    inputBar.classList.add("show");
  } else {
    inputBar.classList.remove("show");
  }
});
