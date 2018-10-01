const styles = theme => ({

  submit: {
    textTransform: 'inherit',
    margin: '0.6rem',
    fontSize: '1.2rem',
    backgroundColor: theme.palette.secondary.main,
  },
  textField: {
    width: '50%',
    minWidth: '20rem',
    maxWidth: '30rem',
  },
  lead: {
    fontSize: '1.3rem',
  },
  formTitle: {
    fontSize: '4rem',
  },
  form: {
    //width: '50%',
    //minWidth: '20rem'
    minWidth: '100vw',
  },
  formFields:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }


});
export default styles;
