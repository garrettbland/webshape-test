import { createElement, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

/**
 * Mock data from database
 */
const DB_BLOCKS = JSON.stringify([
  {
    id: 'newwwww',
    type: 'div',
    classList: ['bg-green-400'],
    children: [
      {
        id: '342423',
        type: 'p',
        data: 'Database stuff',
        classList: [],
      },
      {
        id: '1112222',
        type: 'p',
        data: 'Air horn',
        classList: ['text-lg', 'font-bold'],
      },
    ],
  },
]);

/**
 * Available block types
 */
enum HtmlContainerTypes {
  div = 'div',
  section = 'section',
}
enum HtmlContentTypes {
  p = 'p',
  h1 = 'h1',
  h2 = 'h2',
  img = 'img',
}

/**
 * All block types extends this
 */
type BaseBlock = {
  id: string;
  classList: string[];
};

/**
 * All html container-like blocks
 */
interface ContainerBlock extends BaseBlock {
  type: keyof typeof HtmlContainerTypes;
  children: Block[];
}

/**
 * All html content-like blocks
 */
interface ContentBlock extends BaseBlock {
  type: keyof typeof HtmlContentTypes;
  data: string;
}

/**
 * A single block is either a container or content block
 */
type Block = ContainerBlock | ContentBlock;

/**
 * RequiredJSX Block Component Props
 */
interface BlockProps {
  className: string;
  key: string;
  'data-block-id': string;
}

/**
 * This function will recursively build JSX from array passed in.
 * Adds a few elements to html depending on block type
 */
const generateJSX = (blocks: Block[]): (JSX.Element | undefined)[] => {
  return blocks.map((block) => {
    const isContainerType = Object.values(HtmlContainerTypes).includes(
      block.type as HtmlContainerTypes
    );

    const blockProps: BlockProps = {
      className: block.classList.join(' '),
      key: block.id,
      'data-block-id': block.id,
    };

    return createElement(
      block.type,
      blockProps,
      isContainerType
        ? generateJSX((block as ContainerBlock).children)
        : (block as ContentBlock).data
    );
  });
};

const defaultBlocks: Block[] = [
  {
    id: '1018493',
    type: HtmlContainerTypes.div,
    classList: ['bg-red-400'],
    children: [
      {
        id: '342423',
        type: HtmlContentTypes.p,
        data: 'This is a test',
        classList: [],
      },
      {
        id: '1112222',
        type: HtmlContentTypes.p,
        data: 'This is another paragraph yo',
        classList: [],
      },
    ],
  },
];

export const App = () => {
  const [blocks, setBlocks] = useState<Block[]>(() => defaultBlocks);

  const addBlock = (block?: Block): void => {
    const newBlock: Block = {
      id: nanoid(),
      type: HtmlContentTypes.p,
      data: 'Woot a new one boi',
      classList: ['bg-blue-100'],
    };
    setBlocks((currentBlocks) => [...currentBlocks, newBlock]);
  };

  const importFromDb = () => {
    console.log('TEST |', 'import db');
    const parsedBlocks = JSON.parse(DB_BLOCKS);
    console.log('TEST parsed|', parsedBlocks);
    setBlocks((currentBlocks) => [...currentBlocks, ...parsedBlocks]);
  };

  return (
    <>
      <>{generateJSX(blocks)}</>
      <div onClick={() => addBlock()}>Add Block</div>
      <div onClick={() => importFromDb()}>Import</div>
    </>
  );
};
