import React from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';

function ProfilePage() {
  const { id } = useParams();

  return (
    <div>
      <AudioPlayer userId={id} />
    </div>
  );
}

export default ProfilePage;
