import React, { Component } from 'react';
import MainContent from './InviteDesign3.css';

import { InviteDesign3 } from '../InviteDesigns'
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies()


class PublicInvite extends Component {
        state = {
          // for testing 
          userLoaded: true,
        }
  
    componentDidMount() {
          let wedding_id = localStorage.getItem('weddingID');
          let userdata = cookies.get('USERDATA')
          let oauth_id = '117923096476841958425'
          console.log('userdata:', oauth_id)
  
          if(oauth_id){
              axios.post(`http://${process.env.REACT_APP_LOCAL_URL || 'vbeloved.now.sh'}/loaduser`, {...userdata, oauth_id})
              .then(res => {
                  console.log(res)
                  cookies.set('userID', '117923096476841958425')
                  localStorage.setItem('weddingID', res.data.couple[0].wedding_id)
                  this.props.login() //toggles the state of the user to loggedIn (in MainContent component)
                  this.props.setUser(res.data.couple[0], res.data.couple[1], res.data.guests, [ {...res.data.couple[0]}, {...res.data.couple[1]} ])
                  this.setState({
                     userLoaded: true 
                  })
              }).catch(err => console.log(err))
          } 

          console.log(this.props.coupleData.first_name)
      }

  render() {

    return (
      <React.Fragment>
        <InviteDesign3 />
      </React.Fragment>
    )

    // return (
    //   <div className="invite-cont">
    //         <div className="invite-main">
    //           <div className='i-top'>
    //             {`${this.props.coupleData.first_name} & ${this.props.coupleData.p_firstname}`}
    //           </div> 
    //           <div className='i-middle'>
    //             hi
    //           </div >
    //           <div className='i-bottom'>
    //             hi
    //           </div>
    //         </div>
    //   </div>
    // );
  }
}

export default PublicInvite;