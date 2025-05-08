import React from 'react';
import { useParams } from 'react-router-dom';
import { useClient } from '../hooks/useClients';
import ContactDetailComponent from '../components/contacts/ContactDetail';
import Loader from '../components/common/Loader';

const ContactDetail = () => {
  const { id } = useParams();
  const { client, loading, error } = useClient(id);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading contact: {error}</div>;
  if (!client) return <div>Contact not found</div>;
  
  return <ContactDetailComponent client={client} />;
};

export default ContactDetail;