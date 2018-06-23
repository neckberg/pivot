'use strict';

//create a file-specific context via a function
(function(Piv, ElectionId) {
    var View = Piv.view

    var headerStyle = {"class": "font-size-1"}

    // page layout
    Piv.html(View.workspace, "h1", "Snapshots", headerStyle)
    var SnapshotsDiv = Piv.div(View.workspace, "Snapshots", "text1")
    Piv.html(View.workspace, "h1", "Candidates", headerStyle)
    var CandidatesDiv = Piv.div(View.workspace, "Candidates", "text1")
    Piv.html(View.workspace, "h1", "Ballots", headerStyle)
    var BallotsDiv = Piv.div(View.workspace, "Ballots", "text1")
    Piv.html(View.workspace, "h1", "Tie-Breaker (partial)", headerStyle)
    var TiePartialDiv = Piv.div(View.workspace, "TiePartial", "text1")
    Piv.html(View.workspace, "h1", "Tie-Breaker (total)", headerStyle)
    var TieTotalDiv = Piv.div(View.workspace, "TieTotal", "text1")
    Piv.html(View.workspace, "h1", "Results", headerStyle)
    var ResultsDiv = Piv.div(View.workspace, "Results", "text1")
    Piv.html(View.workspace, "h1", "Plot", headerStyle)
    var PlotDiv = Piv.div(View.workspace, "Plot", "text1")

    function main() {
        // generic setup
        View.setHeader("Election Debugger", ElectionId)
        View.statusbar.innerHTML = ""
        Piv.electionsMenu(View.sidenav, ElectionId)
        Piv.removeHrefsForCurrentLoc()

        // start workflow
        getSnapshots()
    }

    function getSnapshots() {
        // fetch snapshots
        Piv.http.get(["/api/elections/" + ElectionId + "/result_snapshots"],
                     gotSnapshots, showErrorMessage)
    }

    function gotSnapshots(snapshots) {
        snapshots.forEach(snapshot => {
            var button = piv.html(SnapshotsDiv, "button", snapshot.id)
            button.onclick = function() {
                getSnapshot(snapshot.id)
            }
        })
    }

    function getSnapshot(SnapshotId) {
        Piv.http.get(["/api/elections/" + ElectionId + "/result_snapshots/" + SnapshotId],
                     gotSnapshot, showErrorMessage)
    }

    function gotSnapshot(snapshot) {
        if (snapshot.format_version < 3) {
            alert("You can only debug snapshots with version 3 or greater.  This one was version " + snapshot.format_version + ".")
            return
        }
        console.log(snapshot)

        CandidatesDiv.innerHTML = ""
        snapshot.result_blob.debug_private.candidates.forEach(candidate => {
            piv.html(CandidatesDiv, "span", candidate.id + ": " + candidate.name + "<br>")
        })
    }

    function showErrorMessage(error) {
        alert(error)
        Piv.div(View.workspace, "", "w100 text3", "Results for this election are not currently available.")
        if (!error) return
        Piv.div(View.workspace, "", "100 text3", error.response.data.message)
    }

    main(piv, election)
})(piv, election)