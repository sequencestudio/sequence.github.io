import React from 'react'
import { graphql } from "gatsby";
import site_image from "../assets/images/site.jpg";
// Components
import Layout from "../layouts/index"
import Leaderboard from "../components/leaderboard/"
import Seo from '../components/seo';

class Leaderboards extends React.Component{

  render(){

    return (
      <Layout pathname="/leaderboards">
        <Seo
          path="/leaderboards"
          description="Only 13% of ALL teams Beat The Bomb, but do you have what it takes to top the Global Leaderboard?"
          title="Beat The Bomb | Leaderboard | Is Your Team on Top?"
          seoImage={`https://beatthebomb.com${site_image}`}
        />
        <Leaderboard data={this.props.data}/>
      </Layout>
  )
  }
  
}

export default Leaderboards;

export const lQuery = graphql`
query MyQuery {
  allContentfulAsset(filter: {title: {eq: "proleague-2022"}}) {
    nodes {
      title
      gatsbyImageData(
        placeholder: BLURRED
        breakpoints: [175, 250, 320, 375, 425, 768, 1024, 1440]
        width:1920
      )
    }
  }
  allContentfulLeaderboard {
    nodes {
      richText {
        raw
      }
      bkStartDate(formatString: "YYYYMMDD")
      bkEndDate(formatString: "YYYYMMDD")
      atlStartDate(formatString: "YYYYMMDD")
      atlEndDate(formatString: "YYYYMMDD")
      dcStartDate(formatString: "YYYYMMDD")
      dcEndDate(formatString: "YYYYMMDD")
    }
  }
}
`