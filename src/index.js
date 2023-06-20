import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect } from 'react-konva';
import './index.css'

const SIDE = 20;

function generateShapes() {
  return [...Array(100)].map((_, i) => ({
    id: i.toString(),


    initialX: i % 10 * 25,
    initialY: Math.trunc(i / 10) * 25,

    extendedX: i % 10 * 25 - 1,
    extendedY: Math.trunc(i / 10) * 25 - 1,

    reducedX: i % 10 * 25 + 1,
    reducedY: Math.trunc(i / 10) * 25 + 1,


    initialWidth: SIDE,
    initialHeight: SIDE,

    extendedWidth: SIDE + 2,
    extendedHeight: SIDE + 2,

    reducedWidth: SIDE - 2,
    reducedHeight: SIDE - 2,
  }));
}

const INITIAL_STATE = generateShapes();

const App = () => {
  const [rects, setRects] = useState(INITIAL_STATE);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const [stage, setStage] = useState({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
    scale: 2,
    x: 0,
    y: 0
  });

  const wheelHandler = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 
      ? oldScale < 2 
        ? oldScale * scaleBy 
        : oldScale 
      : oldScale > 0.5
        ? oldScale / scaleBy 
        : oldScale;

    setStage({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
    });
  };

  const clickHandler = (e, animation, width, height, x, y) => {
    e.target.to({
      width,
      height,
      x,
      y,
      duration: 0.1
    })

    if (!animation) {
      e.target.to({
        fill: e.target.attrs.selected ? '#58845c' : '#f7d8ad',
        duration: 0.1
      })

      e.target.setAttrs({
        selected: !e.target.attrs.selected,
      })
    }
  }

  const hoverHandler = (e, cursor, color, width, height, x, y) => {
    e.target.getStage().container().style.cursor = cursor
    
    if (!e.target.attrs.selected) {
      e.target.to({
        fill: color,
        width,
        height,
        x,
        y,
        duration: 0.2
      })
    }
  };

  const dragHandler = (e, cursor) => {
    e.target.getStage().container().style.cursor = cursor
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <Stage
        x={stage.x}
        y={stage.y}
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}

        draggable
        scaleX={stage.scale}
        scaleY={stage.scale}

        onWheel={wheelHandler}

        onMouseDown={e => dragHandler(e, 'grabbing')}
        onMouseUp={e => dragHandler(e, 'grab')}
      >
        <Layer>
          {rects.map(rect => (
            <Rect 
              key={rect.id}
              id={rect.id}

              x={rect.initialX}
              y={rect.initialY}
              width={rect.initialWidth}
              height={rect.initialHeight}
              
              fill={'#abc1ad'}
              cornerRadius={4}
              selected={false}
              
              onClick={e => clickHandler(e, false, rect.extendedWidth, rect.extendedHeight, rect.extendedX, rect.extendedY)}
              onTap={e => clickHandler(e, false, rect.extendedWidth, rect.extendedHeight, rect.extendedX, rect.extendedY)}
              

              onMouseDown={e => clickHandler(e, true, rect.reducedWidth, rect.reducedHeight, rect.reducedX, rect.reducedY)}
              onMouseUp={e => clickHandler(e, true, rect.extendedWidth, rect.extendedHeight, rect.extendedX, rect.extendedY)}

              onMouseEnter={e => hoverHandler(e, 'pointer', '#58845c', rect.extendedWidth, rect.extendedHeight, rect.extendedX, rect.extendedY)}
              onMouseLeave={e => hoverHandler(e, 'grab', '#abc1ad', rect.initialWidth, rect.initialHeight, rect.initialX, rect.initialY)}

            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
