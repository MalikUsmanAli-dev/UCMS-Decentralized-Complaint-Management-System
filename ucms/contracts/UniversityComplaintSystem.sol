// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdminManagement {

    address public owner;
    mapping(address => bool) public admins;

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin");
        _;
    }

    function addAdmin(address _admin) public onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyOwner {
        admins[_admin] = false;
    }
}

contract UniversityComplaintSystem is AdminManagement {

    // FIX 1: renamed from complaintCount → totalComplaints
    // Frontend calls: c.totalComplaints()
    uint public totalComplaints;

    enum Status {
        Submitted,   // 0
        UnderReview, // 1
        InProgress,  // 2
        Resolved,    // 3
        Reopened     // 4
    }

    enum Priority {
        Low,    // 0
        Medium, // 1
        High    // 2
    }

    struct Complaint {
        uint id;
        address student;
        string title;
        string description;
        string department;
        Status status;
        Priority priority;
        uint votes;
        string remarks;
    }

    mapping(uint => Complaint) public complaints;
    mapping(uint => mapping(address => bool)) public voted;

    function registerComplaint(
        string memory _title,
        string memory _description,
        string memory _department,
        Priority _priority
    ) public {
        totalComplaints++;
        complaints[totalComplaints] = Complaint(
            totalComplaints,
            msg.sender,
            _title,
            _description,
            _department,
            Status.Submitted,
            _priority,
            0,
            ""
        );
    }

    function updateStatus(uint _id, Status _status) public onlyAdmin {
        require(_id > 0 && _id <= totalComplaints);
        complaints[_id].status = _status;
    }

    function addRemark(uint _id, string memory _remark) public onlyAdmin {
        require(_id > 0 && _id <= totalComplaints);
        complaints[_id].remarks = _remark;
    }

    function voteComplaint(uint _id) public {
        require(_id > 0 && _id <= totalComplaints);
        require(!voted[_id][msg.sender], "Already voted");
        complaints[_id].votes++;
        voted[_id][msg.sender] = true;
    }

    function reopenComplaint(uint _id) public {
        require(_id > 0 && _id <= totalComplaints);
        require(complaints[_id].student == msg.sender, "Not complaint owner");
        require(complaints[_id].status == Status.Resolved, "Not resolved");
        complaints[_id].status = Status.Reopened;
    }

    // FIX 2: getComplaint now returns all 8 fields the frontend expects
    // Frontend destructures: [title, desc, student, dept, status, priority, votes, remarks]
    // i.e. comp[0]=title, comp[1]=desc, comp[2]=student, comp[3]=dept,
    //      comp[4]=status, comp[5]=priority, comp[6]=votes, comp[7]=remarks
    function getComplaint(uint _id) public view returns (
        string memory title,       // comp[0]
        string memory description, // comp[1]
        address student,           // comp[2]
        string memory department,  // comp[3]
        Status status,             // comp[4]
        Priority priority,         // comp[5]
        uint votes,                // comp[6]
        string memory remarks      // comp[7]
    ) {
        Complaint memory c = complaints[_id];
        return (
            c.title,
            c.description,
            c.student,
            c.department,
            c.status,
            c.priority,
            c.votes,
            c.remarks
        );
    }

    function getStatus(uint _id) public view returns (Status) {
        return complaints[_id].status;
    }

    function getPriority(uint _id) public view returns (Priority) {
        return complaints[_id].priority;
    }

    function getVotes(uint _id) public view returns (uint) {
        return complaints[_id].votes;
    }

    // FIX 3: getMostSupportedComplaint returns a single uint (complaintId only)
    // Frontend calls: Number(await c.getMostSupportedComplaint())
    // Old version returned (uint, uint) — that would give NaN when cast to Number
    function getMostSupportedComplaint() public view returns (uint complaintId) {
        uint highestVotes = 0;
        uint topComplaint = 0;
        for (uint i = 1; i <= totalComplaints; i++) {
            if (complaints[i].votes > highestVotes) {
                highestVotes = complaints[i].votes;
                topComplaint = i;
            }
        }
        return topComplaint;
    }
}
