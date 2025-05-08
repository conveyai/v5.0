const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all todos for the current user
 */
exports.getTodos = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    
    const todos = await prisma.todo.findMany({
      where: {
        OR: [
          { assignedToId: conveyancerId },
          { createdById: conveyancerId }
        ],
        tenantId
      },
      include: {
        matter: {
          select: {
            id: true,
            property_address: true,
            matter_type: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
    
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

/**
 * Get todos for a specific matter
 */
exports.getMatterTodos = async (req, res) => {
  try {
    const { matterId } = req.params;
    const { tenantId } = req.user;
    
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
    
    const todos = await prisma.todo.findMany({
      where: {
        matterId,
        tenantId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
    
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching matter todos:', error);
    res.status(500).json({ error: 'Failed to fetch matter todos' });
  }
};

/**
 * Create a new todo
 */
exports.createTodo = async (req, res) => {
  try {
    const { tenantId, id: conveyancerId } = req.user;
    const {
      title,
      description,
      matterId,
      assignedToId,
      dueDate,
      priority
    } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Check if matter exists (if provided)
    if (matterId) {
      const matter = await prisma.matter.findFirst({
        where: {
          id: matterId,
          tenantId
        }
      });
      
      if (!matter) {
        return res.status(404).json({ error: 'Matter not found' });
      }
    }
    
    // Check if assignee exists (if provided)
    if (assignedToId) {
      const assignee = await prisma.conveyancer.findFirst({
        where: {
          id: assignedToId,
          tenantId
        }
      });
      
      if (!assignee) {
        return res.status(404).json({ error: 'Assignee not found' });
      }
    }
    
    // Create todo
    const todo = await prisma.todo.create({
      data: {
        tenantId,
        title,
        description,
        matterId,
        assignedToId: assignedToId || conveyancerId,
        createdById: conveyancerId,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        status: 'OPEN'
      }
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

/**
 * Update a todo
 */
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const {
      title,
      description,
      assignedToId,
      dueDate,
      priority,
      status
    } = req.body;
    
    // Check if todo exists
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Check if assignee exists (if provided)
    if (assignedToId) {
      const assignee = await prisma.conveyancer.findFirst({
        where: {
          id: assignedToId,
          tenantId
        }
      });
      
      if (!assignee) {
        return res.status(404).json({ error: 'Assignee not found' });
      }
    }
    
    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : todo.dueDate,
        priority,
        status: status || todo.status
      }
    });
    
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

/**
 * Mark a todo as completed
 */
exports.completeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: conveyancerId } = req.user;
    
    // Check if todo exists
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        tenantId
      }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Update todo to completed
    const completedTodo = await prisma.todo.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedById: conveyancerId,
        completedAt: new Date()
      }
    });
    
    res.status(200).json(completedTodo);
  } catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).json({ error: 'Failed to complete todo' });
  }
};