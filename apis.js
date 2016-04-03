var SERVER_URL = "http://octocatwebapi.azurewebsites.net/";

function requestAddRepo(accountId, repoUrl) {
  // TODO
  console.log("Add: accountId:" + accountId + ", repoUrl:" + repoUrl);
}

function requestRemoveRepo(accountId, repoUrl) {
  // TODO
  console.log("Remove: accountId:" + accountId + ", repoUrl:" + repoUrl);
}

function requestListRepos(accountId) {
  // TODO
  console.log("List: accountId:" + accountId);
}

function openWebPage() {
  chrome.tabs.create({url: SERVER_URL});
}
