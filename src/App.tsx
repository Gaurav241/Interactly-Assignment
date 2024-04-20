import React, { useCallback, useState } from 'react';
import ReactFlow, { Controls, MiniMap, Background, useNodesState, useEdgesState, addEdge, EdgeText } from 'reactflow';
import './App.css';
import 'reactflow/dist/style.css';

interface Node {
  id: string;
  position: { x: number; y: number };
  data: { label: React.ReactElement<{}> };
  extraLabel: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
}

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [currText, setText] = useState("");
  const [currId, setId] = useState(1);
  const [currPosX, setPosX] = useState(400);
  const [currPosY, setPosY] = useState(400);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeMouseEnter = (event, node) => {
    if (node.special) return;
    setNodes(currNodes =>
      currNodes.map(currNode => {
        if (currNode.id === node.id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={node.id} data={node.extraLabel} hover={true} />
            }
          };
        }
        return currNode;
      })
    );
  };

  const onNodeMouseLeave = (event, node) => {
    if (node.special) return;
    setNodes(currNodes =>
      currNodes.map(currNode => {
        if (currNode.id === node.id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={node.id} data={node.extraLabel} hover={false} />
            }
          };
        }
        return currNode;
      })
    );
  };

  const onEdgeMouseEnter = (event, edge) => {
    setEdges(currEdge =>
      currEdge.map(currEdge => {
        if (currEdge.id === edge.id) {
          return {
            ...currEdge,
            label: "X"
          };
        }
        return currEdge;
      })
    );
  };

  const onEdgeMouseLeave = (event, edge) => {
    setEdges(currEdge =>
      currEdge.map(currEdge => {
        if (currEdge.id === edge.id) {
          return {
            ...currEdge,
            label: null,
          };
        }
        return currEdge;
      })
    );
  };

  const handleDelete = (id) => {
    setEdges((currEdges) =>
      currEdges.filter((edge) => edge.source !== id && edge.target !== id)
    );

    setNodes((currNodes) =>
      currNodes.filter((node) => node.id !== id)
    );
  };

  const onEdgeClick = (event, edge) => {
    handleDeleteEdge(edge.id);
  };

  function handleDeleteEdge(id: string) {
    setEdges((currEdges) =>
      currEdges.filter((edge) => edge.id !== id)
    );
  }

  const onNodeClick = (id: string) => {
    setNodes((currNodes) =>
      currNodes.map(currNode => {
        if (currNode.id === id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Edit id={id} data={currNode.extraLabel} />,// pass the data to Edit component
            },
          };
        }
        return currNode;
      })
    );
  };

  const handleAdd = () => {
    setNodes((currNodes) => {
      currNodes = [...currNodes,
        {
          id: currId.toString(),
          position: { x: currPosX, y: currPosY },
          data: { label: <Node id={currId.toString()} data={currText} hover={false} /> },
          extraLabel: currText,
        }];
      setId(currId + 1);
      setPosX(400 + (currPosX + 10) % 100);
      setPosY(400 + (currPosY + 10) % 100);
      return currNodes;
    });
  };

  const handleEdit = (id: string, text: string) => {
    setNodes((currNodes) =>
      currNodes.map(currNode => {
        if (currNode.id === id) {
          return {
            ...currNode,
            data: {
              ...currNode.data,
              label: <Node id={id} data={text} hover={false} />,
            },
            extraLabel: text,
          };
        }
        return currNode;
      })
    );
  };

  const Node: React.FC<{ id: string; data: string; hover: boolean }> = (props) => {
    return (
      <div>
        {props.hover ? (
          <div onClick={() => handleDelete(props.id)} className='cross'>&#x274C;</div>
        ) : (
          <></>
        )}
        <div onClick={() => onNodeClick(props.id)} className={props.id + " node"}>
          {props.data}
        </div>
      </div>
    );
  };

  const Edit: React.FC<{ id: string; data: string }> = (props) => {
    const [editText, setEditText] = useState(props.data);

    return (
      <div className='edit'>
        Edit Text
        <input onChange={(e) => setEditText(e.target.value)} className='inp'></input>
        <button onClick={() => handleEdit(props.id, editText)}>Save</button>
      </div>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className='add-node'>
        <input className="add-inp" onChange={(e) => setText(e.target.value)}></input>
        <button className="add-btn" onClick={() => handleAdd()}> Add Node </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onEdgeClick={onEdgeClick}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default App;