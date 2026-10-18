// =========================
// 1. DOM 요소 선택 (6주차)
// =========================
const themeButton = document.querySelector("#themeButton");
const emailInput = document.querySelector("#email");
const emailCount = document.querySelector("#emailCount");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");
const subscribeForm = document.querySelector("#subscribeForm");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
let isSubscribed = false;

// =========================
// 2. click - 테마 변경
// =========================
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark ? "밝은 테마로 변경" : "어두운 테마로 변경";
  console.log("다크 모드 상태:", isDark);
}
themeButton.addEventListener("click", handleThemeClick);

// =========================
// 3. input - 이메일 글자 수
// =========================
function handleEmailInput() {
  const currentLength = emailInput.value.length;
  emailCount.textContent = "현재 입력한 글자 수: " + currentLength + " / 100";
  if (!isSubscribed) {
    subscribeMessage.textContent = "이메일을 입력하고 안내 내용에 동의해 주세요.";
    subscribeMessage.classList.remove("is-error");
  }
}
emailInput.addEventListener("input", handleEmailInput);

// =========================
// 4. change - 동의 체크박스
// =========================
function handleAgreeChange() {
  const agreed = agreeCheck.checked;
  if (isSubscribed) return;
  subscribeButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "안내 내용에 동의했습니다. 학습 소식을 신청할 수 있습니다."
    : "안내 내용에 동의하면 신청 버튼이 활성화됩니다.";
  agreeMessage.classList.toggle("is-ready", agreed);
  console.log("안내 내용 동의:", agreed);
}
agreeCheck.addEventListener("change", handleAgreeChange);

// =========================
// 5. 이메일 신청 기능
// =========================
function makeSubscribeMessage(email) {
  return email === "" ? "이메일 주소를 입력해 주세요." : "학습 소식 신청이 완료되었습니다.";
}
function subscribeNews(event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (email === "") {
    subscribeMessage.textContent = makeSubscribeMessage(email);
    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");
    return;
  }
  if (!emailInput.validity.valid) {
    subscribeMessage.textContent = "올바른 이메일 주소를 입력해 주세요.";
    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");
    return;
  }
  if (!agreeCheck.checked) {
    subscribeMessage.textContent = "안내 내용에 먼저 동의해 주세요.";
    subscribeMessage.classList.remove("is-success");
    subscribeMessage.classList.add("is-error");
    return;
  }
  isSubscribed = true;
  subscribeMessage.textContent = makeSubscribeMessage(email);
  subscribeMessage.classList.remove("is-error");
  subscribeMessage.classList.add("is-success");
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
  emailInput.disabled = true;
  agreeCheck.disabled = true;
  console.log("학습 소식 신청 상태:", isSubscribed);
  console.log("신청 이메일:", email);
}
subscribeForm.addEventListener("submit", subscribeNews);

// =========================
// 6~8. 탭 UI (6주차 유지)
// =========================
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");
  });
  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}
function activateTab(clickedTab) {
  const targetPanel = document.querySelector(clickedTab.dataset.target);
  if (!targetPanel) return;
  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");
  clickedTab.setAttribute("tabindex", "0");
  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}
function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}
tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
  tab.addEventListener("keydown", function (event) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = Array.from(tabs).indexOf(event.currentTarget);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    resetTabsAndPanels();
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

// =========================
// 9. 7주차 - 학습 계획 DOM 선택
// =========================
const planStart = document.querySelector("#planStart");
const planFlow = document.querySelector("#planFlow");
const planSteps = document.querySelectorAll(".plan-step");
const planProgress = document.querySelector("#planProgress");
const planName = document.querySelector("#planName");
const planField = document.querySelector("#planField");
const planLevel = document.querySelector("#planLevel");
const planError = document.querySelector("#planError");
const planSelectError = document.querySelector("#planSelectError");
const planSummary = document.querySelector("#planSummary");
const planCompleteMessage = document.querySelector("#planCompleteMessage");
const planStepNames = ["학습자 정보 입력", "학습 분야 선택", "학습 계획 확인"];

// =========================
// 10. 단계 전환: 입력값은 지우지 않음
// =========================
function showPlanStep(step) {
  planSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });
  planProgress.textContent = step <= 3
    ? step + " / 3 · " + planStepNames[step - 1]
    : "학습 계획 완성!";
}

// 시작: 화면을 열고 첫 입력창에 초점 이동
planStart.addEventListener("click", function () {
  planFlow.hidden = false;
  planStart.hidden = true;
  planStart.setAttribute("aria-expanded", "true");
  showPlanStep(1);
  planName.focus();
});

// =========================
// 11. 1단계 - 이름 필수 검사
// =========================
document.querySelector("#planNext1").addEventListener("click", function () {
  const missingName = planName.value.trim() === "";
  if (missingName) {
    planError.textContent = "이름을 입력해 주세요. 입력 후 다음 단계로 이동할 수 있습니다.";
    planName.classList.add("has-error");
    planName.setAttribute("aria-invalid", "true");
    planName.focus();
    return;
  }
  planError.textContent = "";
  planName.classList.remove("has-error");
  planName.removeAttribute("aria-invalid");
  showPlanStep(2);
  planField.focus();
});
planName.addEventListener("input", function () {
  planError.textContent = "";
  planName.classList.remove("has-error");
  planName.removeAttribute("aria-invalid");
});

// =========================
// 12. 2단계 - 분야·수준 선택 검사
// =========================
function clearPlanSelectError() {
  planSelectError.textContent = "";
  [planField, planLevel].forEach(function (element) {
    element.classList.remove("has-error");
    element.removeAttribute("aria-invalid");
  });
}
planField.addEventListener("change", clearPlanSelectError);
planLevel.addEventListener("change", clearPlanSelectError);
document.querySelector("#planBack2").addEventListener("click", function () {
  showPlanStep(1);
  planName.focus();
});
document.querySelector("#planNext2").addEventListener("click", function () {
  const missingField = planField.value === "";
  const missingLevel = planLevel.value === "";
  if (missingField || missingLevel) {
    planSelectError.textContent = missingField && missingLevel
      ? "학습 분야와 학습 수준을 모두 선택해 주세요."
      : missingField ? "학습 분야를 선택해 주세요." : "학습 수준을 선택해 주세요.";
    planField.classList.toggle("has-error", missingField);
    planLevel.classList.toggle("has-error", missingLevel);
    if (missingField) planField.setAttribute("aria-invalid", "true");
    else planField.removeAttribute("aria-invalid");
    if (missingLevel) planLevel.setAttribute("aria-invalid", "true");
    else planLevel.removeAttribute("aria-invalid");
    (missingField ? planField : planLevel).focus();
    return;
  }
  clearPlanSelectError();

  // 입력된 이름을 HTML로 해석하지 않도록 textContent 사용
  planSummary.replaceChildren();
  [["학습자", planName.value.trim()], ["관심 분야", planField.value], ["학습 수준", planLevel.value]].forEach(function (entry) {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = entry[0] + ": ";
    row.append(strong, document.createTextNode(entry[1]));
    planSummary.append(row);
  });
  showPlanStep(3);
  document.querySelector("#planBack3").focus();
});

// =========================
// 13. 확인 → 완료, 이전 단계로 수정
// =========================
document.querySelector("#planBack3").addEventListener("click", function () {
  showPlanStep(2);
  planField.focus();
});
document.querySelector("#planComplete").addEventListener("click", function () {
  planCompleteMessage.textContent = planName.value.trim() + "님의 '" + planField.value + "' 학습 계획이 완성되었습니다. (수준: " + planLevel.value + ")";
  showPlanStep(4);
  document.querySelector("#planRestart").focus();
});

// =========================
// 14. 다시 시작 - 모든 값과 오류 초기화
// =========================
document.querySelector("#planRestart").addEventListener("click", function () {
  planName.value = "";
  planField.value = "";
  planLevel.value = "";
  planError.textContent = "";
  clearPlanSelectError();
  planName.classList.remove("has-error");
  planName.removeAttribute("aria-invalid");
  planSummary.replaceChildren();
  planCompleteMessage.textContent = "";
  showPlanStep(1);
  planName.focus();
});
