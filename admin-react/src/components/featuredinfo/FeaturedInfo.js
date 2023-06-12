import React from "react";
import "./stylefeaturedInfo.css";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

const FeaturedInfo = () => {
  const adminData = useSelector((state) => state.updateData.dashStats);
  console.log(adminData, "adminData");
  //const locale = useSelector((state) => state.language.language);
  //console.log(locale, "LANGUAGE FeaturedInfo");

  var allKeywords = adminData.allKeywords;
  var numNews = adminData.numNews;
  var numPublications = adminData.numPublications;
  var numberOfAdmins = adminData.numberOfAdmins;
  var numberOfMembers = adminData.numberOfMembers;
  var numberOfVisitors = adminData.numberOfVisitors
  var mostRecentContent = adminData.mostRecentContent;
  if (mostRecentContent.Type == "news") {
    var type = "news";
  } else type = "project";
  var mostRecentNews = adminData.mostRecentNews;
  var mostRecentPublication = adminData.mostRecentPublication;

  console.log(allKeywords, "allKeywords");
  console.log(numNews, "numNews");
  console.log(numPublications, "numPublications");
  console.log(mostRecentNews, "mostRecentNews");
  console.log(mostRecentPublication, "mostRecentPublication");
  console.log(mostRecentContent, "mostRecentContent");

  return (
    <div className="cardsInfo">
      <div className="featured">
      <div className="featuredItem numberMembers">
          <span className="featuredTitle">
            {" "}
            <FormattedMessage id={"Totalnumberofmembers"} />{" "}
          </span>
          <div className="divNumber allKeywords">
            <span className="numberallKeywords">{numberOfMembers}</span>
          </div>
        </div>
        <div className="featuredItem allKeywords">
          <span className="featuredTitle">
            {" "}
            <FormattedMessage id={"Totalnumberofadmins"} />{" "}
          </span>
          <div className="divNumber allKeywords">
            <span className="numberallKeywords">{numberOfAdmins}</span>
          </div>
        </div>
        <div className="featuredItem allKeywords">
          <span className="featuredTitle">
            {" "}
            <FormattedMessage id={"TotalnumberofusersToBeAccepted"} />{" "}
          </span>
          <div className="divNumber allKeywords">
            <span className="numberallKeywords">{numberOfVisitors}</span>
          </div>
        </div>
        </div>
        
        
        
        <div className="cardsInfo">
        <div className="featured">
        <div className="featuredItem allKeywords">
          <span className="featuredTitle">
            {" "}
            <FormattedMessage id={"Totalnumberofkeywords"} />{" "}
          </span>
          <div className="divNumber allKeywords">
            <span className="numberallKeywords">{allKeywords}</span>
          </div>
        </div>
        <div className="featuredItem	numNews">
          <span className="featuredTitle">
            <FormattedMessage id={"Totalnumberofnews"} />
          </span>
          <div className="divNumber numNews">
            <span className="numbernumNews">{numNews}</span>
          </div>
        </div>
        <div className="featuredItem	numPublications">
          <span className="featuredTitle">
            <FormattedMessage id={"Totalnumberofpublications"} />
          </span>
          <div className="divNumber numPublications">
            <span className="numbernumPublications">{numPublications}</span>
          </div>
        </div>
        </div>
      </div>
      <div className="recentContentClass">
        <div className="longItem mostRecentContent">
          <span className="featuredTitle">
            <FormattedMessage id={"mostRecentContentisa"} />
          </span>
          <span className="divlongItemmostRecentContentType">
            <FormattedMessage id={type} />
          </span>

          <div className="divlongItem mostRecentContent">
            <span className="divlongItemmostRecentContentTitle-Title">
              <FormattedMessage id={"title"} />
            </span>
            <span className="divlongItemmostRecentContentTitle">
              {mostRecentContent.Title}
            </span>
            <span className="divlongItemmostRecentContentTitle-Date">
              <FormattedMessage id={"date"} />
            </span>
            <span className="divlongItemmostRecentContentDate">
            <FormattedMessage id="timeMmostRecentContentDate" values={{t: Date.parse(mostRecentContent.Date)}} />
            </span>
          </div>
        </div>
        <div className="longItem mostRecentNews">
          <span className="featuredTitle">
            <FormattedMessage id={"mostRecentNews"} />
          </span>
          <div className="divlongItem mostRecentNews">
          <span className="divlongItemmostRecentContentTitle-Title">
              <FormattedMessage id={"title"} />
            </span>
            <span className="NewsTitle">{mostRecentNews.Title}</span>
            <span className="divlongItemmostRecentContentTitle-Date">
              <FormattedMessage id={"date"} />   </span>
              <FormattedMessage  className="NewsDate" id="timeMostRecentNews" values={{t: Date.parse(mostRecentNews.Date)}} />
          </div>
        </div>

        <div className="longItem mostRecentPublication">
          <span className="featuredTitle">
            <FormattedMessage id={"mostRecentPublication"} />
          </span>
          <div className="divlongItem mostRecentPublication">
          <span className="divlongItemmostRecentContentTitle-Title">
              <FormattedMessage id={"title"} />
            </span>
            <span className="divlongItemostRecentPublicationTitle">
              {mostRecentPublication.Title}
            </span>
            <span className="divlongItemmostRecentContentTitle-Date">
              <FormattedMessage id={"date"} />   </span>
              <FormattedMessage  className="mostRecentPublicationDate" id="timemostRecentPublicationDate" values={{t: Date.parse(  mostRecentPublication.Date)}} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfo;

// setTotalUsers(AdminInfo.NumberOfUsers),

//https://stackoverflow.com/questions/34410655/using-decimals-in-react-native
//https://stackoverflow.com/questions/21278234/does-parsedouble-exist-in-javascript
//setAvgActiv(parseFloat(AdminInfo.AverageActivities).toFixed(2)),

//<section id="AdminInfo-list">

//	</section>

/*MessagesList.PropTypes = {
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			message: PropTypes.string.isRequired,
			author: PropTypes.string.isRequired,
		}).isRequired
	).isRequired
}



/*export default  DashboardData = () => { 

  dispa
/*export default function FeaturedInfo() {
  const [numberUsers, setTotalUsers] = useState("--");
  const [avgActivity, setAvgActiv] = useState("--");

  //"AdminDashboard":{"AverageActivities":1,"PiechartStats":[{"AllOpenActivities":2,"OverDeadline":0,"AllClosedActivities":0}],"NumberOfUsers":2,"LineGraphStats":[{"2022-04-03":2}]}}
  useEffect(() => {
   // connectWSocket((evt) => {
      console.log("WS Dashboard geral:");
      console.log(evt.data);*/
// let statsAdmin = JSON.parse();
//  updateData(statsAdmin);

//   setTotalUsers(statsAdmin.AdminDashboard.NumberOfUsers);

//https://stackoverflow.com/questions/34410655/using-decimals-in-react-native
//https://stackoverflow.com/questions/21278234/does-parsedouble-exist-in-javascript
//   setAvgActiv(parseFloat(statsAdmin.AdminDashboard.AverageActivities).toFixed(2));
//});
/* }, []);*/

/* return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Number of Users:</span>
        <div className="featuredNumberOfUsersContainer">
          <span className="featuredNumberOfUsers">{numberUsers}</span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Average Act/User</span>
        <div className="featuredAverageActUser">
          <span className="featuredAverageActUser">{avgActivity}</span>
        </div>
      </div>
    </div>
  );
}
*/
