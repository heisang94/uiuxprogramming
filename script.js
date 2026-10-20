// =========================
// 1~6주차 기존 기능: 테마, 이메일, 탭 UI
// =========================
const themeButton = document.querySelector('#themeButton');
const emailInput = document.querySelector('#email');
const emailCount = document.querySelector('#emailCount');
const subscribeButton = document.querySelector('#subscribeButton');
const subscribeMessage = document.querySelector('#subscribeMessage');
const subscribeForm = document.querySelector('#subscribeForm');
const agreeCheck = document.querySelector('#agreeCheck');
const agreeMessage = document.querySelector('#agreeMessage');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
let isSubscribed = false;

themeButton.addEventListener('click', function () {
  const isDark = document.body.classList.toggle('dark');
  themeButton.textContent = isDark ? '밝은 테마로 변경' : '어두운 테마로 변경';
});

emailInput.addEventListener('input', function () {
  emailCount.textContent = '현재 입력한 글자 수: ' + emailInput.value.length + ' / 100';
  if (!isSubscribed) {
    subscribeMessage.textContent = '이메일을 입력하고 안내 내용에 동의해 주세요.';
    subscribeMessage.classList.remove('is-error');
  }
});

agreeCheck.addEventListener('change', function () {
  if (isSubscribed) return;
  const agreed = agreeCheck.checked;
  subscribeButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? '안내 내용에 동의했습니다. 학습 소식을 신청할 수 있습니다.'
    : '안내 내용에 동의하면 신청 버튼이 활성화됩니다.';
  agreeMessage.classList.toggle('is-ready', agreed);
});

subscribeForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  let error = '';
  if (!email) error = '이메일 주소를 입력해 주세요.';
  else if (!emailInput.validity.valid) error = '올바른 이메일 주소를 입력해 주세요.';
  else if (!agreeCheck.checked) error = '안내 내용에 먼저 동의해 주세요.';
  if (error) {
    subscribeMessage.textContent = error;
    subscribeMessage.classList.remove('is-success');
    subscribeMessage.classList.add('is-error');
    return;
  }
  isSubscribed = true;
  subscribeMessage.textContent = '학습 소식 신청이 완료되었습니다.';
  subscribeMessage.classList.remove('is-error');
  subscribeMessage.classList.add('is-success');
  subscribeButton.textContent = '신청 완료';
  subscribeButton.disabled = true;
  emailInput.disabled = true;
  agreeCheck.disabled = true;
});

function activateTab(nextTab) {
  tabs.forEach(function (tab) {
    const active = tab === nextTab;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panels.forEach(function (panel) {
    const active = '#' + panel.id === nextTab.dataset.target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}
tabs.forEach(function (tab) {
  tab.addEventListener('click', function () { activateTab(tab); });
  tab.addEventListener('keydown', function (event) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = Array.from(tabs).indexOf(tab);
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

// =========================
// 7주차 기존 기능: 학습 계획 3단계
// =========================
const planStart = document.querySelector('#planStart');
const planFlow = document.querySelector('#planFlow');
const planSteps = document.querySelectorAll('.plan-step');
const planProgress = document.querySelector('#planProgress');
const planName = document.querySelector('#planName');
const planField = document.querySelector('#planField');
const planLevel = document.querySelector('#planLevel');
const planError = document.querySelector('#planError');
const planSelectError = document.querySelector('#planSelectError');
const planSummary = document.querySelector('#planSummary');
const planCompleteMessage = document.querySelector('#planCompleteMessage');
const planStepNames = ['학습자 정보 입력', '학습 분야 선택', '학습 계획 확인'];

function showPlanStep(step) {
  planSteps.forEach(function (item) { item.hidden = Number(item.dataset.step) !== step; });
  planProgress.textContent = step <= 3 ? step + ' / 3 · ' + planStepNames[step - 1] : '학습 계획 완성!';
}

planStart.addEventListener('click', function () {
  planFlow.hidden = false;
  planStart.hidden = true;
  planStart.setAttribute('aria-expanded', 'true');
  showPlanStep(1);
  planName.focus();
});

document.querySelector('#planNext1').addEventListener('click', function () {
  if (!planName.value.trim()) {
    planError.textContent = '이름을 입력해 주세요. 입력 후 다음 단계로 이동할 수 있습니다.';
    planName.classList.add('has-error');
    planName.setAttribute('aria-invalid', 'true');
    planName.focus();
    return;
  }
  planError.textContent = '';
  planName.classList.remove('has-error');
  planName.removeAttribute('aria-invalid');
  showPlanStep(2);
  planField.focus();
});
planName.addEventListener('input', function () {
  planError.textContent = '';
  planName.classList.remove('has-error');
  planName.removeAttribute('aria-invalid');
});

function clearPlanSelectError() {
  planSelectError.textContent = '';
  [planField, planLevel].forEach(function (element) {
    element.classList.remove('has-error');
    element.removeAttribute('aria-invalid');
  });
}
function validatePlanChoices() {
  const missingField = !planField.value;
  const missingLevel = !planLevel.value;
  planSelectError.textContent = missingField && missingLevel
    ? '학습 분야와 학습 수준을 모두 선택해 주세요.'
    : missingField ? '학습 분야를 선택해 주세요.' : missingLevel ? '학습 수준을 선택해 주세요.' : '';
  [ [planField, missingField], [planLevel, missingLevel] ].forEach(function (entry) {
    entry[0].classList.toggle('has-error', entry[1]);
    if (entry[1]) entry[0].setAttribute('aria-invalid', 'true');
    else entry[0].removeAttribute('aria-invalid');
  });
  return !(missingField || missingLevel);
}
planField.addEventListener('change', function () {
  if (planSelectError.textContent) validatePlanChoices();
});
planLevel.addEventListener('change', function () {
  if (planSelectError.textContent) validatePlanChoices();
});
document.querySelector('#planBack2').addEventListener('click', function () {
  showPlanStep(1);
  planName.focus();
});
document.querySelector('#planNext2').addEventListener('click', function () {
  if (!validatePlanChoices()) {
    (!planField.value ? planField : planLevel).focus();
    return;
  }
  clearPlanSelectError();
  planSummary.replaceChildren();
  [['학습자', planName.value.trim()], ['관심 분야', planField.value], ['학습 수준', planLevel.value]].forEach(function (entry) {
    const row = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = entry[0] + ': ';
    row.append(strong, document.createTextNode(entry[1]));
    planSummary.append(row);
  });
  showPlanStep(3);
  document.querySelector('#planBack3').focus();
});
document.querySelector('#planBack3').addEventListener('click', function () {
  showPlanStep(2);
  planField.focus();
});
document.querySelector('#planComplete').addEventListener('click', function () {
  planCompleteMessage.textContent = planName.value.trim() + '님의 \'' + planField.value + '\' 학습 계획이 완성되었습니다. (수준: ' + planLevel.value + ')';
  showPlanStep(4);
  prepareRecommendations();  // 8주차: 7주차의 완료 상태와 연결
  document.querySelector('#goRecommend').focus();
});

document.querySelector('#planRestart').addEventListener('click', function () {
  planName.value = '';
  planField.value = '';
  planLevel.value = '';
  planError.textContent = '';
  clearPlanSelectError();
  planName.classList.remove('has-error');
  planName.removeAttribute('aria-invalid');
  planSummary.replaceChildren();
  planCompleteMessage.textContent = '';
  resetRecommendations(true); // 8주차 연결 데이터도 초기화
  showPlanStep(1);
  planName.focus();
});

// =========================
// 8주차 신규 기능: 맞춤 학습 항목 추천
// 분야·수준별 추천 → 선택 → 미리보기 → 확정 / 취소 / 재선택
// =========================
const recommendGate = document.querySelector('#recommendGate');
const recommendFlow = document.querySelector('#recommendFlow');
const recommendContext = document.querySelector('#recommendContext');
const recommendOptions = document.querySelector('#recommendOptions');
const recommendError = document.querySelector('#recommendError');
const recommendPreview = document.querySelector('#recommendPreview');
const recommendSelected = document.querySelector('#recommendSelected');
const recommendDescription = document.querySelector('#recommendDescription');
const recommendDone = document.querySelector('#recommendDone');
const recommendDoneMessage = document.querySelector('#recommendDoneMessage');
const recommendEmpty = document.querySelector('#recommendEmpty');
let selectedTopic = null;
let currentSuggestions = [];

// 서버 없이 동작하는 학습 안내용 예시 데이터
const learningTopics = {
  'Linux 서버': [
    { title: 'Linux 기본 명령어', description: '파일과 디렉터리를 탐색하고 기본 명령어를 연습합니다.' },
    { title: '계정·권한 관리', description: '사용자 계정과 파일 접근 권한을 설정해 봅니다.' },
    { title: 'Linux 웹 서버 구축', description: '패키지 설치와 서비스 관리로 웹 서버를 실행해 봅니다.' }
  ],
  'Network 기초': [
    { title: 'IP 주소와 서브넷', description: 'IPv4 주소 체계와 서브넷의 개념을 알아봅니다.' },
    { title: '라우팅과 DNS', description: '패킷 전달과 도메인 이름 해석 과정을 학습합니다.' },
    { title: '네트워크 연결 점검', description: 'ping, ip, traceroute 등으로 문제를 진단합니다.' }
  ],
  'Docker / Kubernetes': [
    { title: '컨테이너 기초', description: '이미지와 컨테이너의 차이를 이해합니다.' },
    { title: 'Docker 이미지·볼륨 실습', description: '이미지를 만들고 볼륨을 연결해 데이터를 관리합니다.' },
    { title: 'Kubernetes 배포 실습', description: 'Pod와 Deployment를 생성하고 상태를 확인합니다.' }
  ],
  'AWS 클라우드': [
    { title: '클라우드 기본 개념', description: '리전, 가용 영역, 책임 공유 모델을 이해합니다.' },
    { title: 'IAM·VPC 기초', description: '권한 관리와 가상 네트워크 구성을 공부합니다.' },
    { title: 'EC2 서버 구축', description: '보안 그룹을 설정하고 가상 서버를 실행해 봅니다.' }
  ]
};
const levelStart = { '입문': 0, '기초 학습 경험 있음': 1, '실습 경험 있음': 2 };

function resetRecommendations(lock) {
  selectedTopic = null;
  currentSuggestions = [];
  recommendOptions.replaceChildren();
  recommendOptions.hidden = false;
  recommendError.textContent = '';
  recommendPreview.hidden = true;
  recommendDone.hidden = true;
  recommendEmpty.hidden = true;
  recommendSelected.textContent = '';
  recommendDescription.textContent = '';
  recommendDoneMessage.textContent = '';
  if (lock) {
    recommendFlow.hidden = true;
    recommendGate.hidden = false;
    recommendGate.textContent = '먼저 위에서 학습 계획을 완성해 주세요.';
  }
}

function prepareRecommendations() {
  resetRecommendations(false);
  recommendGate.hidden = true;
  recommendFlow.hidden = false;
  recommendContext.textContent = planName.value.trim() + '님의 추천 · ' + planField.value + ' · ' + planLevel.value;
  const all = learningTopics[planField.value] || [];
  const startIndex = levelStart[planLevel.value];
  currentSuggestions = Number.isInteger(startIndex) ? all.slice(startIndex) : [];
  if (currentSuggestions.length === 0) {
    recommendEmpty.hidden = false;
    return;
  }
  currentSuggestions.forEach(function (topic, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recommend-option';
    button.setAttribute('aria-pressed', 'false');
    const title = document.createElement('strong');
    title.textContent = (index + 1) + '. ' + topic.title;
    const description = document.createElement('span');
    description.textContent = topic.description;
    button.append(title, description);
    button.addEventListener('click', function () { selectTopic(topic, button); });
    recommendOptions.append(button);
  });
}

function selectTopic(topic, button) {
  selectedTopic = topic;
  recommendError.textContent = '';
  recommendOptions.querySelectorAll('button').forEach(function (item) {
    const active = item === button;
    item.classList.toggle('is-selected', active);
    item.setAttribute('aria-pressed', String(active));
  });
  recommendSelected.textContent = topic.title;
  recommendDescription.textContent = topic.description;
  recommendPreview.hidden = false;
  recommendDone.hidden = true;
}

// 완료 화면에서 추천 영역으로 이동한다.
document.querySelector('#goRecommend').addEventListener('click', function () {
  document.querySelector('#recommend').scrollIntoView({ behavior: 'smooth', block: 'start' });
  const firstOption = recommendOptions.querySelector('button');
  if (firstOption) firstOption.focus({ preventScroll: true });
});

document.querySelector('#recommendConfirm').addEventListener('click', function () {
  if (!selectedTopic) {
    recommendError.textContent = '먼저 학습 항목을 선택해 주세요.';
    return;
  }
  recommendDoneMessage.textContent = planName.value.trim() + '님이 선택한 첫 학습 항목은 ‘' + selectedTopic.title + '’입니다. 학습을 시작해 보세요.';
  recommendPreview.hidden = true;
  recommendOptions.hidden = true;
  recommendDone.hidden = false;
  document.querySelector('#recommendChange').focus();
});

function clearTopicSelection() {
  selectedTopic = null;
  recommendError.textContent = '';
  recommendPreview.hidden = true;
  recommendDone.hidden = true;
  recommendOptions.hidden = false;
  recommendOptions.querySelectorAll('button').forEach(function (item) {
    item.classList.remove('is-selected');
    item.setAttribute('aria-pressed', 'false');
  });
  const firstOption = recommendOptions.querySelector('button');
  if (firstOption) firstOption.focus();
}
document.querySelector('#recommendCancel').addEventListener('click', clearTopicSelection);
document.querySelector('#recommendChange').addEventListener('click', clearTopicSelection);
document.querySelector('#recommendReset').addEventListener('click', clearTopicSelection);
