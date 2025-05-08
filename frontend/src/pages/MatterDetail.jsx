import React from 'react';
import { useParams } from 'react-router-dom';
import { useMatter } from '../hooks/useMatters';
import MatterDetailComponent from '../components/matters/MatterDetail';
import Loader from '../components/common/Loader';

const MatterDetail = () => {
  const { id } = useParams();
  const { matter, loading, error } = useMatter(id);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading matter: {error}</div>;
  if (!matter) return <div>Matter not found</div>;
  
  return <MatterDetailComponent matter={matter} />;
};

export default MatterDetail;