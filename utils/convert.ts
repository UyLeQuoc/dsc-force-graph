export function convertDate(timestamp) : string {
  try {
    //time should be server timestamp seconds only
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    let myTime = date.toLocaleTimeString()

    date = mm + '/' + dd + '/' + yyyy;
    return " " + myTime + " " + date;
  } catch (error) {
    return getCurrentDate();
  }
  }

export function getCurrentDate() : string {
    let date : any = new Date();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    let myTime = date.toLocaleTimeString()

    date = mm + '/' + dd + '/' + yyyy;
    return " " + myTime + " " + date;
  }