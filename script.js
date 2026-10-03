// 이메일 입력창을 선택합니다.
const emailInput = document.querySelector("#email");

// 신청 버튼을 선택합니다.
const subscribeButton = document.querySelector("#subscribeButton");

// 결과 안내 문구를 선택합니다.
const subscribeMessage = document.querySelector("#subscribeMessage");

// 이메일 신청 form을 선택합니다.
const subscribeForm = document.querySelector("#subscribeForm");


// 신청 여부를 저장합니다.
let isSubscribed = false;


// 입력 상태에 따라 안내 문구를 반환하는 함수입니다.
function makeSubscribeMessage(email) {

  // 이메일을 입력하지 않은 경우
  if (email === "") {
    return "이메일 주소를 입력해 주세요.";
  }

  // 이메일을 입력한 경우
  return "학습 소식 신청이 완료되었습니다.";
}


// 신청 버튼을 눌렀을 때 실행되는 함수입니다.
function subscribeNews(event) {

  // form 제출 시 페이지가 새로고침되는 것을 막습니다.
  event.preventDefault();


  // 입력된 이메일 값을 가져옵니다.
  const email = emailInput.value.trim();


  // 이메일을 입력하지 않은 경우
  if (email === "") {

    isSubscribed = false;

    subscribeMessage.textContent =
      makeSubscribeMessage(email);

    subscribeMessage.classList.remove("is-success");

    subscribeMessage.classList.add("is-error");

    return;
  }


  // 이메일이 입력된 경우 신청 상태를 true로 변경합니다.
  isSubscribed = true;


  // 안내 문구를 신청 완료 문구로 변경합니다.
  subscribeMessage.textContent =
    makeSubscribeMessage(email);


  // 오류 스타일을 제거합니다.
  subscribeMessage.classList.remove("is-error");


  // 신청 완료 스타일을 적용합니다.
  subscribeMessage.classList.add("is-success");


  // 버튼 문구를 변경합니다.
  subscribeButton.textContent = "신청 완료";


  // 중복 신청을 막기 위해 버튼을 비활성화합니다.
  subscribeButton.disabled = true;


  // 신청 여부를 Console에서 확인합니다.
  console.log("학습 소식 신청 상태:", isSubscribed);

  console.log("신청 이메일:", email);
}


// form의 submit 이벤트와 함수를 연결합니다.
subscribeForm.addEventListener(
  "submit",
  subscribeNews
);