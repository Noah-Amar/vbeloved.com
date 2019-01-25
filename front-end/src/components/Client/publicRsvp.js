import React, { Component } from 'react';
import AddQuestion from './addQuestion';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { Close } from '@material-ui/icons';


// define styles for material-ui components
const styles = {
    rsvpContainer: {
        marginTop: '150px'
    },
    card: {
      width: '30%',
      margin: '0 auto 30px',
      padding: '0 20px 20px'
    },
    topDiv: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    buttonDiv: {
        margin: '60px auto 30px',
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        width: '20%',
        margin: '0 auto 30px'
    }
};

class PublicRsvp extends Component {
    constructor(props) {
        super(props);
        const { pathname } = props.location;
        // get last part of url (wedding_id)
        const w_id = pathname.substr(pathname.lastIndexOf('/') + 1);

        this.state = {
           category: '',
           question: '',
           modalOpen: false,
           weddingId: w_id,
           loading: false,
           weddingExists: true,
           questions: [
              {
                wedding_id: w_id,
                category: 'Guest Name',
                multiple_choice: false,
                question: '',
                answer: ''
              }
           ]
        }
    }

    // load user questions when component mounts
    componentDidMount() {

      const { pathname } = this.props.location;
      const w_id = pathname.substr(pathname.lastIndexOf('/') + 1);
      console.log('wedding pathname', w_id)
      console.log('before everything')

      this.getQuestions(w_id)
    }

    getQuestions = (wed_id) => {
        //http://localhost:8888/${wed_id}/allquestions`
        const question_url = `${process.env.REACT_APP_LOCAL_URL}/${wed_id}/allquestions`
        let questionVar;

        axios.get(question_url)
          .then(qs => {
            questionVar = qs 
            console.log(qs)
            this.setState(prevState => {
              
              const newQuestions =  ([...prevState.questions, ...qs.data])//Object.assign({}, prevState.questions, qs.data )  
              console.log(newQuestions)
              return ({ 
              "questions": newQuestions,
                weddingExists: true,
                loading: false
              })})
          }).catch(error => { console.log(error) })
          
        console.log(questionVar)

        // if (questionVar.data.length > 0) {
        //     // this.setState({ questions: questionVar.res.data })
        //     console.log(this.state.questions)
        //   } else {
        //     console.log('Question array is empty')
        //   }
    }

    // inputHandler = (e, key) => {
    //     this.setState( prevState => {
    //       prevState.questions[key].answer = e.target.value
    //       // const newQuestions = prevState.questions
    //       return ({ 
    //           [e.target.name]: e.target.value,
    //           // questions: newQuestions
    //       });
    //     })
    //   };
      handleChange = (name, key) => event => {

        console.log(event)
        name = name ? name : 'answer' 
        this.setState(prevState => {
            const newValue = event.target.value;
            // const answer = prevState['questions'][key][name]
            // prevState['questions'][key][name] = newValue
            console.log(prevState)
            // return (prevState)
            return ({ [name]: event.target.value })
        });
    };

    // function to conditionally render cards based on the type of card
    renderCards = (q, i) => {
        console.log(this.state.questions[i])
        if (q.category === 'Guest Name') {
            return  <Card style={styles.card} key={i}>
            <CardContent>
                {q.category}
            </CardContent>
            <CardContent>
                {q.question}
                <TextField 
                  fullWidth={true} 
                  label="First Name" 
                  value={this.state.questions[i]}
                  onChange={e => {
                      console.log(e, e.target.value)
                    this.handleChange(q/*false*/, i)(e)
                }}  ></TextField>
                <TextField fullWidth={true} label="Last Name"></TextField>
            </CardContent>
            </Card>
        } else if (q.multiple_choice > 0) {
            return <Card style={styles.card} key={i}>
            <CardContent style={styles.topDiv}>
                {q.category}

            </CardContent>
            <CardContent>
                <FormControl component="fieldset">
                <FormLabel component="legend">{q.question}</FormLabel>
                <RadioGroup>
                    {q.answer.split(",").map(option =>  
                        <FormControlLabel value={option} control={<Radio />} label={option}
                        onChange={e => {
                      console.log(e, e.target.value)
                            this.handleChange(q/*false*/, i)(e)
                        }}  
                    />)}
                </RadioGroup>
                </FormControl>
            </CardContent>
            </Card>
        } else {
            return <Card style={styles.card} key={i}>
                <CardContent style={styles.topDiv}>
                    {q.category}

                </CardContent>
                <CardContent>
                    {q.question}
                    <TextField fullWidth={true}
                      value={this.state.questions[i]['answer']}
                      onChange={e => {
                      console.log(e, e.target.value)
                        this.handleChange(q/*false*/, i)(e)
                      }}  
                    ></TextField>
                </CardContent>
                </Card>
        }
    }

    // functions to open and close modal
    handleOpen = () => {
        this.setState({ modalOpen: true });
    };
    
    handleClose = () => {
        this.setState({ modalOpen: false });
    };


    render() {
      // find "Guest Name" questions

      if (this.state.loading) {
        return (
          <div className="loading-rsvp" style={styles.rsvpContainer}>
            <h1>loading</h1> 
          </div>
        )
      } else if (!this.state.weddingExists) {
        return (
          <div className="wedding-not-exists" style={styles.rsvpContainer}>
            <h1>This wedding is not present in our database.</h1> 
            <p>If you would like to orginize a wedding please login</p>
          </div>
        ) 
      } else {

        // let guestName = this.state.questions.find((q, i) => (
        //   q.category === "Guest Name"
        // ))
        // get rest of questions
        // let questions = this.state.questions.filter(q => q.category !== guestName.category);
          // console.log(questions)
        return (
          <div className="public-rsvp" style={styles.rsvpContainer}>
              {/*this.renderCards(guestName, 0) /* render "Guest Name" question*/} 
                  {this.state.questions.map((q, i) => /* render the remaining questions */
                      this.renderCards(q, i)
              )}
              <div style={styles.buttonDiv}>
                  <Button variant="outlined" onClick={this.handleOpen} style={styles.button}>Add Question</Button>
                  <Button variant="outlined" onClick={this.saveQuestions} style={styles.button}>submit</Button>
              </div>
              <Modal
                  open={this.state.modalOpen}
                  onClose={this.handleClose}>
                  <AddQuestion
                  category={this.state.category}
                  question={this.state.question}
                  addQuestion={this.addQuestion}
                  handleClose={this.handleClose}
                  handleInputChange={this.inputHandler}/>
              </Modal>
          </div>
        );
      }
    }
  }
  
export default PublicRsvp;