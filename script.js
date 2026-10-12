
// =========================
// 1. DOM 요소 선택
// =========================

// 테마 변경 버튼
const themeButton = document.querySelector("#themeButton");

// 이메일 신청 영역
const emailInput = document.querySelector("#email");
const emailCount = document.querySelector("#emailCount");

const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");
const subscribeForm = document.querySelector("#subscribeForm");

// 체크박스와 안내 문구
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");

// 탭 버튼과 콘텐츠를 모두 선택
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// 신청 여부 저장
let isSubscribed = false;


// =========================
// 2. click - 테마 변경
// =========================

function handleThemeClick() {

  // body의 dark 클래스를 추가하거나 제거
  const isDark = document.body.classList.toggle("dark");

  // 현재 테마에 따라 버튼 문구 변경
  themeButton.textContent = isDark
    ? "밝은 테마로 변경"
    : "어두운 테마로 변경";

  console.log("다크 모드 상태:", isDark);
}

themeButton.addEventListener("click", handleThemeClick);


// =========================
// 3. input - 글자 수 표시
// =========================

function handleEmailInput() {

  // 현재 이메일 입력 글자 수
  const currentLength = emailInput.value.length;

  // 화면 안내 문구 변경
  emailCount.textContent =
    "현재 입력한 글자 수: " + currentLength + " / 100";

  // 신청 전 다시 입력하면 이전 오류 메시지 초기화
  if (!isSubscribed) {
    subscribeMessage.textContent =
      "이메일을 입력하고 안내 내용에 동의해 주세요.";

    subscribeMessage.classList.remove("is-error");
  }
}

emailInput.addEventListener("input", handleEmailInput);


// =========================
// 4. change - 체크박스 상태
// =========================

function handleAgreeChange() {

  // 체크박스 선택 여부
  const agreed = agreeCheck.checked;

  // 이미 신청 완료한 경우 비활성화 유지
  if (isSubscribed) {
    return;
  }

  // 동의 여부에 따라 신청 버튼 활성화
  subscribeButton.disabled = !agreed;

  // 안내 문구 변경
  agreeMessage.textContent = agreed
    ? "안내 내용에 동의했습니다. 학습 소식을 신청할 수 있습니다."
    : "안내 내용에 동의하면 신청 버튼이 활성화됩니다.";

  // 선택된 상태에 따라 CSS 변경
  agreeMessage.classList.toggle("is-ready", agreed);

  console.log("안내 내용 동의:", agreed);
}

agreeCheck.addEventListener("change", handleAgreeChange);


// =========================
// 5. 이메일 신청 기능
// =========================

// 이메일 입력 상태에 따른 안내 문구
function makeSubscribeMessage(email) {

  if (email === "") {
    return "이메일 주소를 입력해 주세요.";
  }

  return "학습 소식 신청이 완료되었습니다.";
}

// 신청 버튼 클릭으로 form 제출
function subscribeNews(event) {

  // 페이지 새로고침 방지
  event.preventDefault();

  const email = emailInput.value.trim();

  // 이메일을 입력하지 않은 경우
  if (email === "") {

    subscribeMessage.textContent =
      makeSubscribeMessage(email);

    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");

    return;
  }

  // 이메일 형식이 올바르지 않은 경우
  if (!emailInput.validity.valid) {

    subscribeMessage.textContent =
      "올바른 이메일 주소를 입력해 주세요.";

    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");

    return;
  }

  // 안내 내용에 동의하지 않은 경우
  if (!agreeCheck.checked) {

    subscribeMessage.textContent =
      "안내 내용에 먼저 동의해 주세요.";

    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");

    return;
  }

  // 신청 완료 상태로 변경
  isSubscribed = true;

  subscribeMessage.textContent =
    makeSubscribeMessage(email);

  subscribeMessage.classList.remove("is-error");
  subscribeMessage.classList.add("is-success");

  // 버튼 문구 변경 및 중복 신청 방지
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;

  // 신청 완료 후 입력 요소 잠금
  emailInput.disabled = true;
  agreeCheck.disabled = true;

  console.log("학습 소식 신청 상태:", isSubscribed);
  console.log("신청 이메일:", email);
}

subscribeForm.addEventListener("submit", subscribeNews);


// =========================
// 6. 탭 UI - 선택 상태 초기화
// =========================

function resetTabsAndPanels() {

  // 모든 탭의 선택 상태 제거
  tabs.forEach(function (tab) {

    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");

  });

  // 모든 패널 숨기기
  panels.forEach(function (panel) {

    panel.classList.remove("is-active");
    panel.hidden = true;

  });
}


// =========================
// 7. 탭 UI - 선택한 탭 활성화
// =========================

function activateTab(clickedTab) {

  // HTML의 data-target 값 가져오기
  const targetSelector = clickedTab.dataset.target;

  // 선택한 탭과 연결된 패널 찾기
  const targetPanel = document.querySelector(targetSelector);

  if (!targetPanel) {
    return;
  }

  // 클릭한 탭 활성화
  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");
  clickedTab.setAttribute("tabindex", "0");

  // 연결된 패널 표시
  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;

}


// =========================
// 8. 탭 UI - 클릭 이벤트
// =========================

function handleTabClick(event) {

  // 기존 탭 선택 상태 초기화
  resetTabsAndPanels();

  // 클릭한 탭과 연결된 패널 활성화
  activateTab(event.currentTarget);

}

// 모든 탭 버튼에 이벤트 연결
tabs.forEach(function (tab) {

  tab.addEventListener("click", handleTabClick);

  // 방향키를 사용하여 탭 이동
  tab.addEventListener("keydown", function (event) {

    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    const currentIndex = Array.from(tabs).indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    resetTabsAndPanels();
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();

  });

});
