let allRepos = [];

function toggleDark() {
  document.body.classList.toggle("dark");
}

function searchUser() {
  const username = document.getElementById("username").value;
  const error = document.getElementById("error");
  const profile = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");
  const loader = document.getElementById("loader");
  const filter = document.getElementById("filter");

  if (username === "") {
    error.innerText = "Please enter username";
    return;
  }

  error.innerText = "";
  profile.innerHTML = "";
  reposDiv.innerHTML = "";
  loader.style.display = "block";
  filter.style.display = "none";

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(user => {
      profile.innerHTML = `
        <img src="${user.avatar_url}">
        <h3>${user.name}</h3>
        <p>${user.bio}</p>
        <p>📍 ${user.location}</p>
        <p>Followers: ${user.followers} | Following: ${user.following}</p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;
    })
    .catch(() => {
      error.innerText = "User not found";
      loader.style.display = "none";
    });

  fetch(`https://api.github.com/users/${username}/repos`)
    .then(res => res.json())
    .then(repos => {
      loader.style.display = "none";
      allRepos = repos;
      filter.style.display = "block";
      displayRepos(repos);
    });
}

function displayRepos(repos) {
  const reposDiv = document.getElementById("repos");
  reposDiv.innerHTML = "";

  repos.forEach(repo => {
    reposDiv.innerHTML += `
      <div class="repo">
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description"}</p>
        ⭐ ${repo.stargazers_count}<br>
        <a href="${repo.html_url}" target="_blank">View Repo</a>
      </div>
    `;
  });
}

function filterRepos() {
  const value = document.getElementById("filter").value;
  if (value === "stars") {
    const sorted = [...allRepos].sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    );
    displayRepos(sorted);
  } else {
    displayRepos(allRepos);
  }
}

// Enter key support
document.getElementById("username").addEventListener("keypress", function(e) {
  if (e.key === "Enter") searchUser();
});