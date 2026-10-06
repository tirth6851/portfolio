import type { ExplainerSpec } from '@/data/explainers'
import { NeuralNet } from './NeuralNet'
import { ClassifierViz } from './ClassifierViz'
import { TableCards, RouteList, Pipeline, WeightBars, PoolLanes, TokenAnatomy } from './Lists'
import { GrowthCurves } from './Curves'
import { GenericViz } from './GenericViz'

interface Props {
  spec: ExplainerSpec
  label: string
  from: string[]
  to: string[]
}

export function ExplainerVisual({ spec, label, from, to }: Props) {
  switch (spec.kind) {
    case 'neural':
      return <NeuralNet />
    case 'classifier':
      return <ClassifierViz threshold={spec.threshold} />
    case 'tables':
      return <TableCards spec={spec} />
    case 'routes':
      return <RouteList spec={spec} />
    case 'pipeline':
      return <Pipeline spec={spec} />
    case 'weights':
      return <WeightBars spec={spec} />
    case 'pool':
      return <PoolLanes spec={spec} />
    case 'token':
      return <TokenAnatomy spec={spec} />
    case 'curves':
      return <GrowthCurves classes={spec.classes} />
    default:
      return <GenericViz label={label} from={from} to={to} />
  }
}
