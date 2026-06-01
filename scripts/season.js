(function () {
  var BASE = "https://www.thebluealliance.com/api/v3";
  var TEAM = "frc5669";
  var TBA_KEY = "hkV4s4MDUHWnN0WbRuE2DCOY1LXCklQx5XlCopUULhorwW8YLDwSTQXeLSrQgSnu";

  function tbaFetch(path) {
    return fetch(BASE + path, { headers: { "X-TBA-Auth-Key": TBA_KEY } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  // ── Current Season ────────────────────────────────────────────

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
          var lvl   = st.playoff.level  || "";
          var pStat = st.playoff.status || "";
          var pStr  = [lvl, pStat].filter(Boolean).join(" · ");
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

  // ── Team Stats ────────────────────────────────────────────────

  function renderStats(container, seasons, eventsCount, playoffCount, districtName) {
    var items = [
      { number: seasons,     label: "Seasons" },
      { number: eventsCount, label: "Events" }
    ];
    if (playoffCount !== null) {
      items.push({ number: playoffCount, label: "Playoff Appearances" });
    }

    var stripHtml = items.map(function (s) {
      return '<div class="stat-item">' +
        '<span class="stat-number">' + s.number + '</span>' +
        '<span class="stat-label">'  + s.label  + '</span>' +
        '</div>';
    }).join("");

    var districtHtml = districtName
      ? '<p class="stat-district">' + districtName + '</p>'
      : "";

    container.innerHTML = '<div class="stats-strip">' + stripHtml + '</div>' + districtHtml;
  }

  function loadStats() {
    var container = document.getElementById("team-stats");
    if (!container) return;
    container.innerHTML = '<p class="season-loading">Loading stats…</p>';

    Promise.all([
      tbaFetch("/team/" + TEAM + "/years_participated"),
      tbaFetch("/team/" + TEAM + "/events/simple"),
      tbaFetch("/team/" + TEAM + "/districts")
    ]).then(function (results) {
      var yearsList  = Array.isArray(results[0]) ? results[0] : [];
      var allEvents  = Array.isArray(results[1]) ? results[1] : [];
      var districts  = Array.isArray(results[2]) ? results[2] : [];

      var seasons     = yearsList.length;
      var eventsCount = allEvents.length;

      var districtName = "";
      if (districts.length > 0) {
        var latest = districts.reduce(function (a, b) { return b.year > a.year ? b : a; });
        districtName = latest.display_name || "";
      }

      var playoffPromise = yearsList.length > 0
        ? Promise.all(yearsList.map(function (y) {
            return tbaFetch("/team/" + TEAM + "/events/" + y + "/statuses")
              .then(function (statuses) {
                if (!statuses || typeof statuses !== "object") return 0;
                return Object.keys(statuses).filter(function (k) {
                  return statuses[k] != null && statuses[k].playoff != null;
                }).length;
              })
              .catch(function () { return 0; });
          })).then(function (counts) {
            return counts.reduce(function (a, b) { return a + b; }, 0);
          })
        : Promise.resolve(null);

      playoffPromise.then(function (playoffCount) {
        renderStats(container, seasons, eventsCount, playoffCount, districtName);
      });

    }).catch(function () {
      container.innerHTML = "";
    });
  }

  // ── Init ──────────────────────────────────────────────────────

  function init() {
    loadSeason();
    loadStats();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
