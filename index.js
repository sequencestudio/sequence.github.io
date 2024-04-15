import React, {useEffect, useState}  from 'react'
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
// utility
import formatNumber from "../../utils/formatNumber";
// Styles
import * as styles from "../styles/proBoard.module.css";
import MissionSelect from "./missionSelect"
import LocationSwitch from "./locationSwitch"

const Leaderboard = (props) => {
  const [all_scores, setAll_scores] = useState([]);
  const lb_data = props.data.allContentfulLeaderboard.nodes[0];
  const proleague_img = props.data.allContentfulAsset.nodes[0];
  const mappedHeaderText = (
    <>
      <div className={styles.row_entries}>RANK</div>
      <div className={styles.score_middle}> 
        <div>TEAM NAME</div>
        <div>LOCATION</div>
      </div>
      <div className={styles.row_entries}>TOTAL SCORE</div>
    </>
  );

  const [loading, setLoading]= useState(true);
  const [mission, setMission]= useState("Mission 01: Paint Bomb");
  const [selected, setSelected]= useState("01");
  const [selected_locations, setSelected_locations] = useState(["Brooklyn", "Atlanta", "DC"]);

  useEffect(() => {
    apiRequest().then(scores =>{
      setAll_scores(recursiveSort(scores));
    });
  }, [selected, selected_locations]);

  function recursiveSort( score_arr ){
    if(score_arr.length < 2){
      return [];
    } else if( score_arr.length === 2){
      return sortScores(score_arr[0], score_arr[1]);
    }else {
      return sortScores(score_arr[0], recursiveSort(score_arr.slice(1)));
    }
  }

  const sortScores = ( arr1, arr2 ) => {
    let merged = [];
    let index1 = 0;
    let index2 = 0;
    let current = 0;

    if( arr1.length === 0 ){
      return arr2;
    }

    if( arr2.length === 0 ){
      return arr1;
    }

    // loop until either our current index is longer than the length of both arrays
    // or until we reach the end of one of our array's length
    while ((current < (arr1.length + arr2.length)) && (index1 < arr1.length -1 ) && (index2 < arr2.length)) {
      let unmerged1 = arr1[index1];
      let unmerged2 = arr2[index2];

      // if next comes from arr1
      if (unmerged1.total_score < unmerged2.total_score) {
        merged[current] = arr2[index2];
        merged[current].rank = current + 1;
        index2++;
        current++;

      // if both values are the same we append both and have them
      // the same rank, and increase the current count value by 2
      } else if(unmerged1.total_score === unmerged2.total_score) {
        merged[current] = arr1[index1];
        merged[current].rank = current + 1;
        index1++;
        merged[current+1] = arr2[index2];
        merged[current+1].rank = current + 1;
        index2++;
        current +=2;

      // if next comes from arr2
      } else {
        merged[current] = arr1[index1];
        merged[current].rank = current + 1;
        index1++;
        current++;
      }
    }

    // in the case that we get to the end of the 
    // first array but have yet to append
    // the rest of the second array
    if(index1 === 100){
      for(let i=index2; i<arr2.length; i++){
        merged[current] = arr2[i];
        merged[current].rank = current + 1;
        current++;
      }
    }

    // in case that we get to the end of the 
    // second array but have yet to append
    // the rest of the first array
    if(index2 === 100){
      for(let i=index1; i<arr1.length; i++){
        merged[current] = arr1[i];
        merged[current].rank = current + 1;
        current++;
      }
    }
    return merged;
  }

  function _handleClick(e){
    e.preventDefault();
    setMission(e.target.value);
    setSelected(e.target.value.split(' ')[1]);

  }

  function _toggleLocation(e){
    if(selected_locations.includes(e.target.value)){
      let temp_arr = [];
      const index = selected_locations.indexOf(e.target.value);
      selected_locations.splice(index, 1);
      for(let i=0; i<selected_locations.length; i++){
        temp_arr.push(selected_locations[i]);
      }
      setSelected_locations(temp_arr);
    } else {
      let temp_arr = [];
      for(let i=0; i<selected_locations.length; i++){
        temp_arr.push(selected_locations[i]);
      }
      temp_arr.push(e.target.value)
      setSelected_locations(temp_arr);
    }
  }

  async function apiRequest(){
    setLoading(false);
    const bk_time_start = lb_data.bkStartDate;
    const bk_time_end = lb_data.bkEndDate;
    const atl_time_start = lb_data.atlStartDate;
    const atl_time_end = lb_data.atlEndDate;
    const dc_time_start = lb_data.dcStartDate;
    const dc_time_end = lb_data.dcEndDate;
    const url_brooklyn = `https://btbbrooklyn.ddns.net:8083/sessions/scoreboard/mission/${selected}/type/standard/start/${bk_time_start}/end/${bk_time_end}/offset/0/limit/100`;
    const url_atl = `https://btbatlanta.ddns.net:8083/sessions/scoreboard/mission/${selected}/type/standard/start/${atl_time_start}/end/${atl_time_end}/offset/0/limit/100`
    const url_dc = `https://btbwashington.ddns.net:8083/sessions/scoreboard/mission/${selected}/type/standard/start/${dc_time_start}/end/${dc_time_end}/offset/0/limit/100`;

    // if none are selected then we get all score locations
    if(selected_locations.length === 0){
      return [];
    }
    // for instances where we mix up the locations 
    else {
      let location_arr = [];
      for(let i = 0; i < 3; i++){
        if(selected_locations[i] === "Atlanta"){
          const atlResponse = await fetch(url_atl);
          const atl_json_score = await atlResponse.json();
          atl_json_score.forEach(row => {
            row.location = "Atlanta";
            row.color = "pink"
          })
          location_arr.push(atl_json_score);

        }else if(selected_locations[i] === "Brooklyn"){
          const bkResponse = await fetch(url_brooklyn);
          const bk_json_score = await bkResponse.json();
          bk_json_score.forEach(row => {
            row.location = "Brooklyn";
            row.color = "blue"
          })
         
          location_arr.push(bk_json_score);

        }else if(selected_locations[i] === "DC"){
          const dcResponse = await fetch(url_dc);
          const dc_json_score = await dcResponse.json();
          dc_json_score.forEach(row => {
            row.location = "DC";
            row.color = "green"
          })
          location_arr.push(dc_json_score);
        } else {
          location_arr.push([]);
        }
      }
      return location_arr;
    }
  }

  const mappedScores = (scores) => {
    return scores.length === 0 ? <></>:(scores.map((team, index) => (
      <div className={styles.score__row} key={`${index}-${team.team_name}${team.rank}`}>
        <div style={{ color : `var(--neon-${team.color})` }}>{team.rank}.</div>
        <div className={styles.score_middle}> 
          <div style={{ color : `var(--neon-${team.color})` }}>{team["Team"].name}</div>
          <div style={{ color : `var(--neon-${team.color})` }}>{team.location}</div>
        </div>
        <div style={{ color : `var(--neon-${team.color})` }}>{formatNumber(team.total_score)}</div>
      </div>))
    );
  }

  const json_text = JSON.parse(lb_data.richText.raw);

  const RICHTEXT_OPTIONS = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) =>{
        return <p>{children}</p>
      },
      [BLOCKS.HEADING_1]: (node, children) =>{
        return <h1>{children}</h1>
      }
    }
  }

  return loading ? (
      <div className={styles.loading_wrapper}><span className={styles.loading}>Loading...</span></div>)
      : (
        <div className={styles.leaderboard_container}>
          <MissionSelect _handleClick={_handleClick} selected={mission}/>
          <LocationSwitch _toggleLocation={_toggleLocation}/>
          <div className={styles.leaderboard_columns}>
            <div className={styles.col2}>
              <h2>Leaderboard</h2>
              <div className={styles.leaderboard_bk}>
                <div className={styles.gridHeader_bk}>
                  <div className={styles.gridHeader__lower}>{mappedHeaderText}</div>
                </div>
              
                <div className={styles.gridContent}>
                  {mappedScores(all_scores)}
                </div>
              </div>
            </div>
          </div>
          <GatsbyImage className={styles.pro_image} alt={proleague_img.title}  image={getImage(proleague_img.gatsbyImageData)} />
          <div className={styles.titleHeader}>
            {documentToReactComponents(json_text, RICHTEXT_OPTIONS)}
            <button><a href="https://blast.beatthebomb.com/proleagueopen/">Learn More</a></button>
          </div>
        </div>
        
      );
}

export default Leaderboard;
