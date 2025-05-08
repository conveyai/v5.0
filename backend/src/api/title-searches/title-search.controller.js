const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../../utils/logger');

/**
 * Perform a title search
 */
exports.performTitleSearch = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    const {
      matterId,
      folio_identifier,
      property_address,
      property_suburb,
      property_state,
      property_postcode,
      search_type
    } = req.body;
    
    // Validate required fields
    if (!matterId || !folio_identifier) {
      return res.status(400).json({ error: 'Matter ID and folio identifier are required' });
    }
    
    // Check if matter exists
    const matter = await prisma.matter.findFirst({
      where: {
        id: matterId,
        tenantId
      }
    });
    
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    
    // Simulate title search process
    // In a real application, this would connect to an external API or service
    
    // Create title search record
    const titleSearch = await prisma.titleSearch.create({
      data: {
        tenantId,
        matterId,
        requestedById: conveyancerId,
        folio_identifier,
        property_address: property_address || matter.property_address,
        property_suburb: property_suburb || matter.property_suburb,
        property_state: property_state || matter.property_state,
        property_postcode: property_postcode || matter.property_postcode,
        search_type: search_type || 'STANDARD',
        status: 'PENDING',
        requested_at: new Date()
      }
    });
    
    // In a real app, here we would initiate an async process to handle the title search
    // For this demo, we'll simulate a successful search after a delay
    
    // Update the title search after a delay (simulating processing)
    setTimeout(async () => {
      try {
        await prisma.titleSearch.update({
          where: { id: titleSearch.id },
          data: {
            status: 'COMPLETED',
            results: JSON.stringify({
              owner: 'Example Owner Name',
              title_type: 'Freehold',
              lot: '1',
              plan: 'DP123456',
              area: '650 square meters',
              encumbrances: [
                { type: 'Mortgage', reference: 'AB123456' },
                { type: 'Easement', reference: 'CD789012' }
              ],
              registered_dealings: [
                { dealing: 'Transfer', date: '2020-01-15' },
                { dealing: 'Mortgage', date: '2020-01-15' }
              ]
            }),
            completed_at: new Date()
          }
        });
        
        logger.info(`Title search ${titleSearch.id} completed successfully`);
      } catch (updateError) {
        logger.error(`Failed to update title search ${titleSearch.id}:`, updateError);
      }
    }, 5000);
    
    res.status(201).json(titleSearch);
  } catch (error) {
    logger.error('Error performing title search:', error);
    res.status(500).json({ error: 'Failed to perform title search' });
  }
};

/**
 * Get a title search
 */
exports.getTitleSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    
    const titleSearch = await prisma.titleSearch.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!titleSearch) {
      return res.status(404).json({ error: 'Title search not found' });
    }
    
    // Parse results if they exist
    if (titleSearch.results) {
      titleSearch.results = JSON.parse(titleSearch.results);
    }
    
    res.status(200).json(titleSearch);
  } catch (error) {
    logger.error('Error fetching title search:', error);
    res.status(500).json({ error: 'Failed to fetch title search' });
  }
};