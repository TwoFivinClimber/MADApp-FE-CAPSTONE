import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getSingleDay } from '../../../api/day/dayData';
import DayForm from '../../../components/DayForm';

function EditDay() {
  const [day, setDay] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

  useEffect(() => {
    getSingleDay(firebaseKey).then(setDay);
  }, [firebaseKey]);

  return (
    <DayForm obj={day} />
  );
}

export default EditDay;
