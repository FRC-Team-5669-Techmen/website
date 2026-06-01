(function () {
  const BASE = "https://www.thebluealliance.com/api/v3";
  const TEAM = "frc5669";
  const TBA_KEY = "REPLACE_WITH_YOUR_TBA_READ_KEY";

  function tbaFetch(path) {
    return fetch(BASE + path, { headers: { "X-TBA-Auth-Key": TBA_KEY } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  function formatDate(str) {
    if (!str) return "";
    var parts = str.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2])
      .toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function renderEvents(events, statuses) {
    var container = document.getElementById("current-season");
    if (!container) return;

    if (!events || events.length === 0) {
      container.innerHTML = '<p class="season-empty">Season results will post here once competition begins.</p>';
      return;
    }

    events.sort(function (a, b) { return a.start_date > b.start_date ? 1 : -1; });

    var rows = events.map(function (ev) {
      var st = statuses && statuses[ev.key];

      var dateStr = (ev.start_date && ev.end_date && ev.start_date !== ev.end_date)
        ? formatDate(ev.start_date) + "–" + formatDate(ev.end_date)
        : formatDate(ev.start_date);

      var location = [ev.city, ev.state_prov].filter(Boolean).join(", ");

      var statusHtml = "";
      if (st) {
        var rank = st.qual && st.qual.ranking && st.qual.ranking.rank;
        var rec  = st.qual && st.qual.ranking && st.qual.ranking.record;
        if (rank != null || rec) {
          var recStr = rec ? (rec.wins + "-" + rec.losses + "-" + rec.ties) : "";
          statusHtml += '<span class="season-qual">Rank ' + (rank != null ? rank : "—") +
            (recStr ? " &nbsp;·&nbsp; " + recStr : "") + "</span>";
        }
        if (st.playoff) {
          var lvl    = st.playoff.level  || "";
          var pStat  = st.playoff.status || "";
          var pStr   = [lvl, pStat].filter(Boolean).join(" · ");
          if (pStr) statusHtml += '<span class="season-playoff">Playoffs: ' + pStr + "</span>";
        }
      }

      return '<li class="season-event">' +
        '<span class="season-name">' + (ev.name || ev.key) + "</span>" +
        '<span class="season-meta">' + dateStr + (location ? " &nbsp;·&nbsp; " + location : "") + "</span>" +
        statusHtml +
        "</li>";
    });

    container.innerHTML = '<ul class="season-list">' + rows.join("") + "</ul>";
  }

  function loadSeason() {
    var container = document.getElementById("current-season");
    if (!container) return;
    container.innerHTML = '<p class="season-loading">Loading current season…</p>';

    var year = new Date().getFullYear();
    var years = [year, year - 1];
    var idx = 0;

    function tryYear() {
      if (idx >= years.length) {
        container.innerHTML = '<p class="season-empty">Season results will post here once competition begins.</p>';
        return;
      }
      var y = years[idx++];
      tbaFetch("/team/" + TEAM + "/events/" + y + "/simple")
        .then(function (data) {
          if (!Array.isArray(data) || data.length === 0) { tryYear(); return; }
          tbaFetch("/team/" + TEAM + "/events/" + y + "/statuses")
            .then(function (statuses) { renderEvents(data, statuses); })
            .catch(function () { renderEvents(data, {}); });
        })
        .catch(function () { tryYear(); });
    }

    tryYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSeason);
  } else {
    loadSeason();
  }
})();
