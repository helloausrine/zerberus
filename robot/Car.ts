import { Motor } from './Motor'
import wait from './wait'

export enum Direction {
  left = 'left',
  right = 'right',
}

function otherDirection(direction: Direction): Direction {
  return direction === Direction.left ? Direction.right : Direction.left
}

export default function (motors: {left: Motor, right: Motor}) {
  return {
    /*
      Accelerate car to the given speed.
      The speed is specified as a percentage of the motor's max speed.
      Speed can also be negative, so that the car runs backwards.
      The car only accelerated in a way, that battery and controller health is preserved.
    */
    async accelerate(speed: number) {
      await Promise.all([
        motors.left.accelerate(speed),
        motors.right.accelerate(speed)
      ])
    },

    stop() {
      motors.left.stop()
      motors.right.stop()
    },

    float() {
      motors.left.float()
      motors.right.float()
    },

    /*
      Turn the car in the given direction to a given degree.
      If 'onTheSpot' is set true, the wheels will turn in different directions.
    */
    async turn(degrees: number, direction: Direction, onTheSpot = false) {
      const motor = motors[otherDirection(direction)]
      const currentSpeed = motor.speed
      if (onTheSpot) {
        motor.float()
        await motor.accelerate(-currentSpeed)
      } else {
        motor.float()
      }
      await wait(18.5 * degrees)
      await motor.accelerate(currentSpeed)
    },
  }
}
